<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Barra de navegación -->
    <header class="bg-brand-200 shadow-md">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <RouterLink to="/" class="text-xl font-bold text-brand-900 tracking-tight hover:text-brand-400 transition-colors">
            Control de Acceso por Roles
          </RouterLink>
          <p class="text-brand-400 text-xs mt-0.5">Vue Router · Route Guards · TypeScript</p>
        </div>
        <UserSwitcher />
      </div>
    </header>

    <!-- Vista activa -->
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import UserSwitcher from './components/UserSwitcher.vue'
import { currentUser } from './services/auth'

// Log del estado en la consola del navegador cada vez que cambie
watch(
  currentUser,
  (estado) => {
    console.log('[Estado actual]', { ...estado })
  },
  { deep: true, immediate: true }
)
</script>
