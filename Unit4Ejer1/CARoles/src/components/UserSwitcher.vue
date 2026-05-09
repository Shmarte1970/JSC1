<template>
  <div class="flex items-center gap-3 flex-wrap">

    <!-- Sesión activa -->
    <template v-if="user.isAuthenticated">
      <div class="flex items-center gap-2">
        <span class="text-sm text-brand-900 font-medium">{{ user.nombre }}</span>
        <span :class="badgeClass">{{ user.role }}</span>
      </div>
      <button
        @click="cerrarSesion"
        class="text-xs font-semibold text-brand-400 hover:text-brand-900 border border-brand-300 px-3 py-1.5 rounded-lg transition-colors"
      >
        Cerrar sesión
      </button>
    </template>

    <!-- Sin sesión -->
    <template v-else>
      <select
        v-model="seleccionado"
        class="text-sm border border-brand-300 rounded-lg px-3 py-1.5 bg-white text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-300"
      >
        <option value="" disabled>Selecciona usuario...</option>
        <option v-for="u in USERS" :key="u.nombre" :value="u.nombre">
          {{ u.nombre }}
        </option>
      </select>
      <button
        @click="conectar"
        :disabled="!seleccionado"
        class="text-xs font-semibold bg-brand-300 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-brand-900 px-3 py-1.5 rounded-lg transition-colors"
      >
        Conectar
      </button>
    </template>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { currentUser, USERS, login, logout } from '../services/auth'

const router      = useRouter()
const user        = currentUser
const seleccionado = ref('')

// La contraseña de cada usuario en USERS — la buscamos por nombre
function conectar(): void {
  const found = USERS.find(u => u.nombre === seleccionado.value)
  if (!found) return
  login(found.nombre, found.password)
  seleccionado.value = ''
}

function cerrarSesion(): void {
  logout()
  router.push('/')
}

const badgeClass = computed(() => {
  const map: Record<string, string> = {
    Admin:  'bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full',
    Editor: 'bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full',
    Guest:  'bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full',
  }
  return map[user.role] ?? map['Guest']
})
</script>
