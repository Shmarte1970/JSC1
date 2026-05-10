<template>
  <header class="bg-brand-200 shadow-md">
    <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">

      <!-- Logo / título -->
      <div>
        <RouterLink
          to="/tasks"
          class="text-xl font-bold text-brand-900 tracking-tight hover:text-brand-400 transition-colors"
        >
          Gestión de Tareas
        </RouterLink>
        <p class="text-brand-400 text-xs mt-0.5">Vue 3 · TypeScript · Vue Router</p>
      </div>

      <!-- Navegación -->
      <nav class="flex items-center gap-3">

        <!-- Link a perfil (Ejercicio 1) -->
        <RouterLink
          to="/profile"
          class="flex items-center gap-2 bg-white/30 hover:bg-white/50 transition-colors px-3 py-1.5 rounded-xl"
          active-class="bg-white/60"
        >
          <span
            class="w-7 h-7 rounded-full bg-brand-400 text-white flex items-center justify-center text-xs font-bold shrink-0"
          >
            {{ initials }}
          </span>
          <span class="text-sm font-medium text-brand-900">
            {{ user?.fullName || user?.email || 'Mi perfil' }}
          </span>
        </RouterLink>

        <!-- Cerrar sesión -->
        <button
          @click="handleLogout"
          class="text-xs font-semibold text-brand-400 hover:text-brand-900 border border-brand-300 px-3 py-1.5 rounded-lg transition-colors"
        >
          Cerrar sesión
        </button>

      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { getUser, logout } from '../services/auth'

const router = useRouter()
const user   = computed(() => getUser())

const initials = computed(() => {
  const name = user.value?.fullName ?? ''
  if (name) return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')
  return user.value?.email?.[0]?.toUpperCase() ?? '?'
})

function handleLogout(): void {
  logout()
  router.push('/login')
}
</script>
