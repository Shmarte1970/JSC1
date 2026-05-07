<script setup lang="ts">
import type { Song } from '../models/song.interface';

defineProps<{ song: Song }>();
</script>

<template>
  <div :class="['song-item', song.isTopHit ? 'song-item--top' : 'song-item--normal']">
    <div class="song-item__header">
      <span class="song-item__title">{{ song.title }}</span>
      <span v-if="song.isTopHit" class="song-item__fire">🔥</span>
    </div>
    <p class="song-item__artist">{{ song.artist }}</p>
    <div class="song-item__footer">
      <span class="song-item__duration">{{ song.duration }}</span>
      <span :class="['song-item__badge', song.isTopHit ? 'song-item__badge--top' : 'song-item__badge--normal']">
        {{ song.isTopHit ? 'ÉXITO ACTUAL' : 'CANCIÓN' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.song-item {
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-left: 4px solid;
  background-color: #fff7ed;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.song-item--top {
  border-color: #f97316;
}

.song-item--normal {
  border-color: #cbd5e1;
}

.song-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.song-item__title {
  font-weight: 700;
  font-size: 0.95rem;
  color: #1e293b;
}

.song-item__fire {
  font-size: 1rem;
}

.song-item__artist {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

.song-item__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
}

.song-item__duration {
  font-size: 0.8rem;
  color: #94a3b8;
}

.song-item__badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.song-item__badge--top {
  background-color: #fff7ed;
  color: #ea580c;
  border: 1.5px solid #f97316;
}

.song-item__badge--normal {
  background-color: #f1f5f9;
  color: #64748b;
}
</style>
