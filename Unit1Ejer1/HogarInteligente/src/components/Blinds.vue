<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref<boolean>(true)

function toggle(): void {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="widget">
    <div class="widget-header">
      <span class="icon">⊞</span>
      <span class="label">Persianas</span>
    </div>
    <p class="status">{{ isOpen ? 'Abiertas' : 'Cerradas' }}</p>
    <button @click="toggle">{{ isOpen ? 'Cerrar' : 'Abrir' }}</button>
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
  gap: 0.6rem;
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

.status {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #a6e3a1;
}

button {
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  border: none;
  background: #89b4fa;
  color: #1e1e2e;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.9rem;
  align-self: flex-start;
}

button:hover {
  background: #b4befe;
}
</style>
