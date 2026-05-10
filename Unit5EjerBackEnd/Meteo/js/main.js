export const METEO_ESTACIONS_URL = 'https://api.meteo.cat/xema/v1/estacions/metadades';
export const METEO_API_KEY       = 'u3DfW3MfBN6ozAAesvqIN6VF7caKzlqL4XaTemwr';
const LOCAL_JSON                 = 'src/data/meteo.json';
const PAGE_SIZE                  = 10;
const MAX_DROPDOWN_ITEMS         = 50;

// ─── Elements del DOM ────────────────────────────────────────────────────────
const btnLoad           = document.getElementById('btn-load');
const btnClear          = document.getElementById('btn-clear');
const btnSearch         = document.getElementById('btn-search');
const searchInput       = document.getElementById('search-input');
const autocompleteList  = document.getElementById('autocomplete-list');
const loading           = document.getElementById('loading');
const errorMsg          = document.getElementById('error-msg');
const resultsSection    = document.getElementById('results-section');
const counter           = document.getElementById('counter');
const stationsContainer = document.getElementById('stations-container');
const sliderSection     = document.getElementById('slider-section');
const pageSlider        = document.getElementById('page-slider');
const sliderLabelRight  = document.getElementById('slider-label-right');

let allLocalStations = [];   // dades del JSON local
let activeResults    = [];   // conjunt actiu per paginació

// ─── Càrrega inicial del JSON local ──────────────────────────────────────────
async function initLocalData() {
  try {
    const response   = await fetch(LOCAL_JSON);
    allLocalStations = await response.json();
    allLocalStations.sort((a, b) => a.nom.localeCompare(b.nom));
  } catch {
    searchInput.disabled    = true;
    searchInput.placeholder = 'Error en carregar dades locals';
  }
}

// ─── Autocomplete: obrir dropdown ────────────────────────────────────────────
searchInput.addEventListener('focus', () => {
  renderDropdown(allLocalStations);
});

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = query
    ? allLocalStations.filter(s =>
        s.nom.toLowerCase().includes(query) ||
        s.codi.toLowerCase().includes(query)
      )
    : allLocalStations;
  renderDropdown(filtered);
});

btnSearch.addEventListener('click', () => {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = query
    ? allLocalStations.filter(s =>
        s.nom.toLowerCase().includes(query) ||
        s.codi.toLowerCase().includes(query)
      )
    : allLocalStations;

  closeDropdown();

  if (filtered.length === 0) {
    showError('Cap estació coincideix amb la cerca.');
    return;
  }
  errorMsg.classList.add('hidden');
  setActiveResults(filtered);
});

function renderDropdown(stations) {
  autocompleteList.innerHTML = '';

  const items = stations.slice(0, MAX_DROPDOWN_ITEMS);

  if (items.length === 0) {
    autocompleteList.innerHTML = '<li class="autocomplete-empty">Cap resultat</li>';
  } else {
    items.forEach(station => {
      const li = document.createElement('li');
      li.textContent = `[${station.codi}] ${station.nom}`;
      li.addEventListener('mousedown', (e) => {
        // mousedown abans del blur per poder capturar el clic
        e.preventDefault();
        searchInput.value = station.nom;
        closeDropdown();
        errorMsg.classList.add('hidden');
        setActiveResults([station]);
      });
      autocompleteList.appendChild(li);
    });

    if (stations.length > MAX_DROPDOWN_ITEMS) {
      const li = document.createElement('li');
      li.className = 'autocomplete-more';
      li.textContent = `+${stations.length - MAX_DROPDOWN_ITEMS} més… escriu per filtrar`;
      autocompleteList.appendChild(li);
    }
  }

  autocompleteList.classList.remove('hidden');
}

function closeDropdown() {
  autocompleteList.classList.add('hidden');
  autocompleteList.innerHTML = '';
}

// Tancar dropdown si es clica fora
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-station')) closeDropdown();
});

// ─── Botó: Carregar totes des de la API ──────────────────────────────────────
btnLoad.addEventListener('click', loadAllStations);

async function loadAllStations() {
  searchInput.value = '';
  closeDropdown();
  btnLoad.disabled  = true;
  loading.classList.remove('hidden');
  errorMsg.classList.add('hidden');
  resultsSection.classList.add('hidden');

  try {
    const response = await fetch(METEO_ESTACIONS_URL, {
      headers: { 'X-Api-Key': METEO_API_KEY }
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    const stations = await response.json();
    setActiveResults(stations);
  } catch (error) {
    showError(`No s'han pogut carregar les estacions: ${error.message}`);
    btnLoad.disabled = false;
  } finally {
    loading.classList.add('hidden');
  }
}

// ─── Slider ───────────────────────────────────────────────────────────────────
pageSlider.addEventListener('input', () => {
  renderPage(Number(pageSlider.value));
});

// ─── Botó: Netejar ────────────────────────────────────────────────────────────
btnClear.addEventListener('click', () => {
  stationsContainer.innerHTML = '';
  resultsSection.classList.add('hidden');
  errorMsg.classList.add('hidden');
  activeResults     = [];
  btnLoad.disabled  = false;
  btnClear.disabled = true;
  searchInput.value = '';
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function setActiveResults(stations) {
  activeResults = stations;

  const needsSlider = stations.length > PAGE_SIZE;
  const maxOffset   = Math.max(0, stations.length - PAGE_SIZE);

  pageSlider.min   = 0;
  pageSlider.max   = maxOffset;
  pageSlider.step  = PAGE_SIZE;
  pageSlider.value = 0;

  sliderSection.classList.toggle('hidden', !needsSlider);

  renderPage(0);
  btnClear.disabled = false;
  btnLoad.disabled  = false;
}

function renderPage(offset) {
  const page  = activeResults.slice(offset, offset + PAGE_SIZE);
  const from  = offset + 1;
  const to    = Math.min(offset + PAGE_SIZE, activeResults.length);
  const total = activeResults.length;

  counter.textContent          = `Mostrant ${from}–${to} de ${total} estacions`;
  sliderLabelRight.textContent = `${to} / ${total}`;

  stationsContainer.innerHTML = '';
  page.forEach(renderCard);

  resultsSection.classList.remove('hidden');
}

function renderCard(station) {
  const estatActual = station.estats?.at(-1);
  const activa      = estatActual?.codi === 1 && estatActual?.dataFi === null;
  const lat         = station.coordenades?.latitud?.toFixed(5)  ?? '—';
  const lon         = station.coordenades?.longitud?.toFixed(5) ?? '—';

  const card = document.createElement('article');
  card.classList.add('station-card', activa ? 'activa' : 'inactiva');

  card.innerHTML = `
    <div class="station-header">
      <span class="station-code">${station.codi}</span>
      <span class="station-status ${activa ? 'badge-activa' : 'badge-inactiva'}">
        ${activa ? '&#9679; Activa' : '&#9675; Inactiva'}
      </span>
    </div>
    <h3 class="station-name">${station.nom}</h3>
    <ul class="station-details">
      <li><strong>Tipus:</strong> ${station.tipus ?? '—'}</li>
      <li><strong>Emplaçament:</strong> ${station.emplacament ?? '—'}</li>
      <li><strong>Altitud:</strong> ${station.altitud != null ? station.altitud + ' m' : '—'}</li>
      <li><strong>Coordenades:</strong> ${lat}, ${lon}</li>
      <li><strong>Municipi:</strong> ${station.municipi?.nom ?? '—'}</li>
      <li><strong>Comarca:</strong> ${station.comarca?.nom ?? '—'}</li>
      <li><strong>Província:</strong> ${station.provincia?.nom ?? '—'}</li>
      <li><strong>Xarxa:</strong> ${station.xarxa?.nom ?? '—'}</li>
    </ul>
  `;

  stationsContainer.appendChild(card);
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove('hidden');
}

// ─── Inicialització ───────────────────────────────────────────────────────────
initLocalData();
