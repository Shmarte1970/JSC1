<script setup lang="ts">
import Header from './components/Header.vue'
import Container from './components/Container.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="app-wrapper">
    <Header />
    <Container />
    <Footer />
  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-wrapper > :last-child {
  margin-top: auto;
}
</style>
