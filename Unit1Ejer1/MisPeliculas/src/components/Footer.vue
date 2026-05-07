<script setup lang="ts">
</script>

<template>
  <footer>
    <p>Mis películas &copy; {{ new Date().getFullYear() }}</p>
  </footer>
</template>

<style scoped>
footer {
  background: #1e1e2e;
  border-top: 1px solid #313244;
  padding: 1rem 2rem;
  text-align: center;
}

p {
  margin: 0;
  font-size: 0.85rem;
  color: #a6adc8;
}
</style>
