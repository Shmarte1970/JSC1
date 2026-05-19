<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />
    <div class="flex-1 flex flex-col items-center justify-center text-center px-4 gap-4">
      <div class="text-8xl">🔍</div>
      <h1 class="text-4xl font-bold text-gray-800">404</h1>
      <h2 class="text-xl font-medium text-gray-500">Página no encontrada</h2>
      <p class="text-gray-400 max-w-sm">
        La página que buscas no existe o ha sido movida.
      </p>
      <RouterLink :to="{ name: 'landing' }" class="btn btn-primary btn-lg mt-2">
        Volver al inicio
      </RouterLink>
    </div>
  </div>
</template>
