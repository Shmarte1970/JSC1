<script setup lang="ts">
import { ref } from 'vue'

const isOn = ref<boolean>(false)
const intensity = ref<number>(70)

function toggle(): void {
  isOn.value = !isOn.value
}
</script>

<template>
  <div class="widget">
    <div class="widget-header">
      <span class="icon" @click="toggle">💡</span>
      <span class="label">Luces</span>
    </div>

    <template v-if="isOn">
      <p class="intensity-value">{{ intensity }}%</p>
      <input
        v-model="intensity"
        type="range"
        min="0"
        max="100"
        class="slider"
      />
      <button @click="toggle">Apagar</button>
    </template>
    <template v-else>
      <button @click="toggle">Encender</button>
    </template>
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
  cursor: pointer;
}

.label {
  font-weight: 600;
  font-size: 0.95rem;
}

.intensity-value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f9e2af;
}

.slider {
  width: 100%;
  accent-color: #f9e2af;
  cursor: pointer;
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
