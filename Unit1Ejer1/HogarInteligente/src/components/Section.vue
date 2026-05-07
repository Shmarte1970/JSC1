<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <section class="room-section">
    <h2 class="section-title">{{ title }}</h2>
    <div class="section-content">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.room-section {
  background: #1e1e2e;
  border-radius: 16px;
  padding: 1.5rem 2rem;
  color: #cdd6f4;
}

.section-title {
  margin: 0 0 1.25rem;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #89b4fa;
  border-bottom: 1px solid #313244;
  padding-bottom: 0.75rem;
}

.section-content {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
}
</style>
