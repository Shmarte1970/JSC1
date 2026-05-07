<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Movie } from '../models/movie.interface'
import moviesData from '../data/movies.json'

const movies = ref<Movie[]>(moviesData as Movie[])
const onlyInTheaters = ref<boolean>(false)

const filteredMovies = computed<Movie[]>(() => {
  if (onlyInTheaters.value) {
    return movies.value.filter((m) => m.inTheaters)
  }
  return movies.value
})

function toggleFilter(): void {
  onlyInTheaters.value = !onlyInTheaters.value
}
</script>

<template>
  <div class="container">
    <div class="toolbar">
      <button @click="toggleFilter" :class="{ active: onlyInTheaters }">
        {{ onlyInTheaters ? 'Mostrar todas' : 'En cines' }}
      </button>
      <span class="counter">{{ filteredMovies.length }} películas</span>
    </div>

    <ul class="movie-list">
      <li v-for="movie in filteredMovies" :key="movie.id" class="movie-card">
        <div class="movie-info">
          <h2 class="movie-title">{{ movie.title }}</h2>
          <p class="movie-meta">{{ movie.genre }} · {{ movie.year }}</p>
        </div>
        <div class="movie-right">
          <span class="rating">★ {{ movie.rating }}</span>
          <span v-if="movie.inTheaters" class="badge">En cines</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

button {
  padding: 0.45rem 1.1rem;
  border-radius: 8px;
  border: none;
  background: #313244;
  color: #cdd6f4;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #45475a;
}

button.active {
  background: #89b4fa;
  color: #1e1e2e;
}

.counter {
  font-size: 0.9rem;
  color: #a6adc8;
}

.movie-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.movie-card {
  background: #1e1e2e;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #313244;
}

.movie-title {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 700;
  color: #cdd6f4;
}

.movie-meta {
  margin: 0;
  font-size: 0.85rem;
  color: #a6adc8;
}

.movie-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
}

.rating {
  font-size: 0.95rem;
  font-weight: 700;
  color: #f9e2af;
}

.badge {
  font-size: 0.75rem;
  font-weight: 600;
  background: #a6e3a1;
  color: #1e1e2e;
  padding: 0.2rem 0.55rem;
  border-radius: 99px;
}
</style>
