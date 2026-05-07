<script setup lang="ts">
</script>

<template>
  <div class="widget weather-widget">
    <h2>El tiempo</h2>
    <p class="condition">Soleado</p>
    <p class="temperature">22 °C</p>
    <p class="description">Cielos despejados durante toda la jornada.</p>
  </div>
</template>

<style scoped>
.widget {
  background: #1e1e2e;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  color: #cdd6f4;
}

h2 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #89b4fa;
}

.condition {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
}

.temperature {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: #fab387;
}

.description {
  margin: 0;
  font-size: 0.9rem;
  color: #a6adc8;
}
</style>
