<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import type { User } from '@/types'

const router = useRouter()
const user   = ref<User | null>(null)
const menuOpen = ref(false)

onMounted(async () => {
  if (authService.isAuthenticated()) {
    try {
      user.value = await authService.getProfile()
    } catch {
      // token inválido
    }
  }
})

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function logout() {
  authService.logout()
  user.value     = null
  menuOpen.value = false
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="bg-white border-b border-gray-100 shadow-soft sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

      <!-- Logo -->
      <RouterLink :to="{ name: 'landing' }" class="flex items-center gap-2 font-semibold text-sage-500 text-lg no-underline">
        🛒 <span>Lista de la Compra</span>
      </RouterLink>

      <!-- Nav autenticado -->
      <nav v-if="user" class="hidden sm:flex items-center gap-1">
        <RouterLink :to="{ name: 'products' }" class="nav-link">Productos</RouterLink>
        <RouterLink :to="{ name: 'lists' }"    class="nav-link">Mis Listas</RouterLink>
      </nav>

      <!-- Usuario -->
      <div v-if="user" class="relative flex items-center gap-2">
        <button
          class="flex items-center gap-2 hover:bg-gray-100 rounded-xl px-2 py-1 transition-colors"
          @click="menuOpen = !menuOpen"
        >
          <span class="w-8 h-8 rounded-full bg-sage-200 text-sage-700 text-xs font-bold flex items-center justify-center">
            {{ initials(user.name) }}
          </span>
          <span class="hidden sm:block text-sm text-gray-600 max-w-[120px] truncate">{{ user.name }}</span>
          <span class="text-gray-400 text-xs">▾</span>
        </button>

        <!-- Dropdown -->
        <div
          v-if="menuOpen"
          class="absolute right-0 top-12 w-44 bg-white border border-gray-100 rounded-2xl shadow-medium py-1 z-50"
          @click="menuOpen = false"
        >
          <RouterLink :to="{ name: 'profile' }" class="dropdown-item">Mi perfil</RouterLink>
          <RouterLink :to="{ name: 'products' }" class="dropdown-item sm:hidden">Productos</RouterLink>
          <RouterLink :to="{ name: 'lists' }"    class="dropdown-item sm:hidden">Mis listas</RouterLink>
          <hr class="my-1 border-gray-100">
          <button class="dropdown-item text-red-500 w-full text-left" @click="logout">Cerrar sesión</button>
        </div>
      </div>

      <!-- Sin sesión -->
      <div v-else class="flex items-center gap-2">
        <RouterLink :to="{ name: 'login' }"    class="btn btn-secondary btn-sm">Entrar</RouterLink>
        <RouterLink :to="{ name: 'register' }" class="btn btn-primary  btn-sm">Registrarse</RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav-link {
  @apply px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors no-underline;
}
.nav-link.router-link-active {
  @apply bg-sage-50 text-sage-600 font-medium;
}
.dropdown-item {
  @apply block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors no-underline cursor-pointer;
}
</style>
