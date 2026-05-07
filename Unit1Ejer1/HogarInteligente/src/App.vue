<script setup lang="ts">
import Section from './components/Section.vue'
import Lamps from './components/Lamps.vue'
import Blinds from './components/Blinds.vue'
import Music from './components/Music.vue'
import Car from './components/Car.vue'
import LastCharge from './components/LastCharge.vue'
</script>

<template>
  <main>
    <h1>Hogar inteligente</h1>
    <div class="dashboard">
      <Section title="Habitación">
        <Lamps />
        <Blinds />
        <Music />
      </Section>

      <Section title="Coche eléctrico">
        <Car />
        <LastCharge />
      </Section>
    </div>
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
  background: #181825;
  padding: 2rem;
}

h1 {
  color: #cdd6f4;
  text-align: center;
  margin: 0 0 2rem;
  font-size: 1.8rem;
  letter-spacing: 0.05em;
}

.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}
</style>
