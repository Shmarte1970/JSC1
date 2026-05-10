const SEARCH_API = 'https://openlibrary.org/search.json';
const OL_BASE    = 'https://openlibrary.org';
const COVER_BASE = 'https://covers.openlibrary.org/b/id';
const LIMIT      = 20;

const form             = document.getElementById('search-form');
const input            = document.getElementById('search-input');
const loading          = document.getElementById('loading');
const errorMsg         = document.getElementById('error-msg');
const resultsSection   = document.getElementById('results-section');
const resultsCount     = document.getElementById('results-count');
const resultsContainer = document.getElementById('results-container');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = input.value.trim();
  if (query) searchBooks(query);
});

async function searchBooks(query) {
  setLoadingState(true);

  try {
    const url = `${SEARCH_API}?q=${encodeURIComponent(query)}&limit=${LIMIT}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    const data = await response.json();
    renderResults(data);
  } catch (error) {
    showError(`No se pudo completar la búsqueda: ${error.message}`);
  } finally {
    setLoadingState(false);
  }
}

function renderResults(data) {
  resultsContainer.innerHTML = '';

  if (!data.docs || data.docs.length === 0) {
    showError('No se encontraron libros para esa búsqueda.');
    resultsSection.classList.add('hidden');
    return;
  }

  errorMsg.classList.add('hidden');
  resultsSection.classList.remove('hidden');

  const total = data.numFound.toLocaleString('es-ES');
  resultsCount.textContent = `${data.docs.length} resultados mostrados de ${total} encontrados`;

  data.docs.forEach(book => {
    const title   = book.title || 'Título desconocido';
    const authors = book.author_name ? book.author_name.join(', ') : 'Autor desconocido';
    const year    = book.first_publish_year || '—';
    const olUrl   = `${OL_BASE}${book.key}`;
    const coverUrl = book.cover_i
      ? `${COVER_BASE}/${book.cover_i}-M.jpg`
      : null;

    const card = document.createElement('article');
    card.classList.add('book-card');

    card.innerHTML = `
      <div class="book-cover">
        ${coverUrl
          ? `<img src="${coverUrl}" alt="Portada de ${title}" />`
          : `<div class="no-cover">&#128214;</div>`
        }
      </div>
      <div class="book-info">
        <h3 class="book-title">${title}</h3>
        <p class="book-author">&#9998; ${authors}</p>
        <p class="book-year">&#128197; ${year}</p>
        <a href="${olUrl}" target="_blank" rel="noopener noreferrer" class="btn-ol">
          Ver en OpenLibrary &#8599;
        </a>
      </div>
    `;

    resultsContainer.appendChild(card);
  });
}

function setLoadingState(isLoading) {
  loading.classList.toggle('hidden', !isLoading);
  resultsSection.classList.toggle('hidden', isLoading);
  errorMsg.classList.add('hidden');
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.remove('hidden');
}
