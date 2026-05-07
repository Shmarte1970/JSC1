<script setup lang="ts">
import { ref, computed } from 'vue';
import SongItem from './SongItem.vue';
import type { Song } from '../models/song.interface';

const props = defineProps<{ songs: Song[] }>();

const showOnlyTopHits = ref(false);

const filteredSongs = computed(() =>
  showOnlyTopHits.value ? props.songs.filter(s => s.isTopHit) : props.songs
);
</script>

<template>
  <section class="container">
    <div class="container__toolbar">
      <div class="container__counter">
        <span>Mostrando <strong>{{ filteredSongs.length }}</strong></span>
        <span>Total: <strong>{{ songs.length }}</strong></span>
      </div>
      <button class="btn-filter" @click="showOnlyTopHits = !showOnlyTopHits">
        {{ showOnlyTopHits ? 'Mostrar todas' : 'Éxitos' }}
      </button>
    </div>

    <div class="container__grid">
      <SongItem v-for="song in filteredSongs" :key="song.id" :song="song" />
    </div>
  </section>
</template>

<style scoped>
.container {
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.container__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.container__counter {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #475569;
}

.btn-filter {
  padding: 0.45rem 1.1rem;
  background-color: #6366f1;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-filter:hover {
  opacity: 0.85;
}

.container__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

@media (max-width: 768px) {
  .container__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .container__grid {
    grid-template-columns: 1fr;
  }
}
</style>
