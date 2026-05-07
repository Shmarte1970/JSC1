<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const isCharging = ref<boolean>(false)
const batteryLevel = ref<number>(42)
let interval: number

function connect(): void {
  isCharging.value = true
  interval = setInterval(() => {
    if (batteryLevel.value < 100) {
      batteryLevel.value++
    } else {
      clearInterval(interval)
      isCharging.value = false
    }
  }, 300)
}

function disconnect(): void {
  isCharging.value = false
  clearInterval(interval)
}

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div class="widget">
    <div class="widget-header">
      <span class="icon">🚗</span>
      <span class="label">Vehículo eléctrico</span>
    </div>

    <p class="status">
      {{ isCharging ? 'Cargando' : 'Desconectado' }} · {{ batteryLevel }}%
    </p>

    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: batteryLevel + '%' }"></div>
    </div>

    <button v-if="!isCharging" @click="connect">Conectar</button>
    <button v-else @click="disconnect" class="disconnect">Desconectar</button>
  </div>
</template>

<style scoped>
.widget {
  background: #313244;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  color: #cdd6f4;
  min-width: 200px;
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

.progress-bar {
  width: 100%;
  height: 10px;
  background: #45475a;
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #a6e3a1;
  border-radius: 99px;
  transition: width 0.25s ease;
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

.disconnect {
  background: #f38ba8;
}

.disconnect:hover {
  background: #eba0ac;
}
</style>
