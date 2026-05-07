<script setup lang="ts">
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import SongListContainer from './components/SongListContainer.vue';
import type { Song } from './models/song.interface';
import songsData from './data/songs.json';

const songs: Song[] = songsData;
</script>

<template>
  <div class="layout">
    <Header />
    <SongListContainer :songs="songs" />
    <Footer />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: #f8fafc;
  font-family: sans-serif;
}

.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
