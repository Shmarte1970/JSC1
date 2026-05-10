import { CHARACTERS_API } from './config.js';

const charactersContainer = document.getElementById('characters-container');
const loading = document.getElementById('loading');

const HOUSE_COLORS = {
  Gryffindor: '#740001',
  Slytherin:  '#1a472a',
  Hufflepuff: '#ecb939',
  Ravenclaw:  '#0e1a40',
};

async function fetchCharacters() {
  try {
    const response = await fetch(CHARACTERS_API);
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const characters = await response.json();
    renderCharacters(characters);
  } catch (error) {
    loading.textContent = `Error al cargar los personajes: ${error.message}`;
    loading.classList.add('error');
  }
}

function renderCharacters(characters) {
  loading.style.display = 'none';

  characters.forEach(character => {
    const houseColor = HOUSE_COLORS[character.hogwartsHouse] || '#2c2c2c';
    const children = character.children.length > 0
      ? character.children.join(', ')
      : 'Ninguno';

    const card = document.createElement('article');
    card.classList.add('character-card');
    card.style.borderTopColor = houseColor;

    card.innerHTML = `
      <img src="${character.image}" alt="${character.fullName}" />
      <div class="character-info">
        <h3>${character.fullName}</h3>
        ${character.nickname ? `<p class="nickname">"${character.nickname}"</p>` : ''}
        <ul>
          <li><strong>Casa:</strong>
            <span class="house-badge" style="background:${houseColor}">
              ${character.hogwartsHouse || 'Desconocida'}
            </span>
          </li>
          <li><strong>Actor/Actriz:</strong> ${character.interpretedBy || 'Desconocido'}</li>
          <li><strong>Fecha de nacimiento:</strong> ${character.birthdate || 'Desconocida'}</li>
          <li><strong>Hijos:</strong> ${children}</li>
        </ul>
      </div>
    `;

    charactersContainer.appendChild(card);
  });
}

fetchCharacters();
