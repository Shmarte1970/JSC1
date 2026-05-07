<script setup lang="ts">
</script>

<template>
  <div class="widget">
    <div class="widget-header">
      <span class="icon">⚡</span>
      <span class="label">Última carga</span>
    </div>
    <p class="energy">16.3 kWh</p>
    <p class="date">Domingo · 23:24</p>
  </div>
</template>

<style scoped>
.widget {
  background: #313244;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  color: #cdd6f4;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.widget-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  font-size: 1.4rem;
}

.label {
  font-weight: 600;
  font-size: 0.95rem;
}

.energy {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: #f9e2af;
}

.date {
  margin: 0;
  font-size: 0.9rem;
  color: #a6adc8;
}
</style>
