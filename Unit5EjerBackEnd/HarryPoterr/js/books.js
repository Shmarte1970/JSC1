import { BOOKS_API } from './config.js';

const booksContainer = document.getElementById('books-container');
const loading = document.getElementById('loading');

async function fetchBooks() {
  try {
    const response = await fetch(BOOKS_API);
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const books = await response.json();
    renderBooks(books);
  } catch (error) {
    loading.textContent = `Error al cargar los libros: ${error.message}`;
    loading.classList.add('error');
  }
}

function renderBooks(books) {
  loading.style.display = 'none';

  books.forEach(book => {
    const card = document.createElement('article');
    card.classList.add('book-card');

    card.innerHTML = `
      <img src="${book.cover}" alt="Portada de ${book.title}" />
      <div class="book-info">
        <span class="book-number">Libro ${book.number}</span>
        <h3>${book.title}</h3>
        <p class="book-meta">
          <span>&#128197; ${book.releaseDate}</span>
          <span>&#128196; ${book.pages} páginas</span>
        </p>
        <p class="book-description">${book.description}</p>
      </div>
    `;

    booksContainer.appendChild(card);
  });
}

fetchBooks();
