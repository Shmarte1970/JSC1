<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref<string>('')

function updateTime(): void {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('es-ES')
}

let interval: number

onMounted(() => {
  updateTime()
  interval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div class="widget clock-widget">
    <h2>Hora actual</h2>
    <p class="time">{{ currentTime }}</p>
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

.time {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  font-variant-numeric: tabular-nums;
}
</style>
