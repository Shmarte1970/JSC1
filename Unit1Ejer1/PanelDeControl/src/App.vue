<script setup lang="ts">
import ClockWidget from './components/ClockWidget.vue'
import WeatherWidget from './components/WeatherWidget.vue'
import NotesWidget from './components/NotesWidget.vue'
</script>

<template>
  <main>
    <h1>Panel de control</h1>
    <div class="dashboard">
      <ClockWidget />
      <WeatherWidget />
      <NotesWidget />
    </div>
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
  background: #181825;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

h1 {
  color: #cdd6f4;
  text-align: center;
  margin: 0 0 2rem;
  font-size: 1.8rem;
  letter-spacing: 0.05em;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}
</style>
