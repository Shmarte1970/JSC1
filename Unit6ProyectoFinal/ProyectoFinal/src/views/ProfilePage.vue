<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <main class="max-w-2xl mx-auto px-6 py-10">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        <!-- Banner con avatar -->
        <div class="bg-gradient-to-r from-brand-200 to-brand-300 px-8 py-10 flex items-center gap-6">
          <div class="w-20 h-20 rounded-full bg-white/50 flex items-center justify-center text-3xl font-bold text-brand-900 shrink-0">
            {{ initials }}
          </div>
          <div>
            <h1 class="text-2xl font-bold text-brand-900">
              {{ user?.fullName || user?.email || 'Usuario' }}
            </h1>
            <p class="text-brand-400 text-sm mt-1">Perfil de usuario</p>
          </div>
        </div>

        <!-- Datos de solo lectura -->
        <div class="px-8 py-6 space-y-5">
          <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Datos del perfil
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <!-- Correo electrónico (solo lectura) -->
            <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p class="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
                Correo electrónico
              </p>
              <p class="text-gray-800 font-medium">{{ user?.email }}</p>
            </div>

            <!-- Estado de la cuenta (solo lectura) -->
            <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p class="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
                Activo
              </p>
              <span
                :class="user?.active
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-600'"
                class="text-xs font-semibold px-2.5 py-0.5 rounded-full"
              >
                {{ user?.active ? 'Sí' : 'No' }}
              </span>
            </div>

            <!-- ID de usuario (solo lectura) -->
            <div class="bg-gray-50 rounded-xl p-4 border border-gray-100 sm:col-span-2">
              <p class="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
                ID
              </p>
              <p class="text-gray-700 font-mono text-xs break-all">{{ user?.id }}</p>
            </div>

          </div>

        </div>

        <!-- Sección editable -->
        <div class="px-8 pb-6 space-y-5 border-t border-gray-100 pt-6">
          <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Editar perfil
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <!-- Nombre completo (editable) -->
            <div class="sm:col-span-2">
              <label class="block text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1.5">
                Nombre completo
              </label>
              <input
                v-model="form.fullName"
                type="text"
                placeholder="Tu nombre completo"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent transition"
              />
            </div>

            <!-- Teléfono (editable) -->
            <div>
              <label class="block text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1.5">
                Teléfono
              </label>
              <input
                v-model="form.phone"
                type="tel"
                placeholder="+34 000 000 000"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent transition"
              />
            </div>

            <!-- Alias (editable) -->
            <div>
              <label class="block text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1.5">
                Alias
              </label>
              <input
                v-model="form.alias"
                type="text"
                placeholder="@alias"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent transition"
              />
            </div>

          </div>

          <!-- Mensaje de éxito -->
          <p
            v-if="savedMsg"
            class="text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-4 py-2"
          >
            {{ savedMsg }}
          </p>

          <!-- Leyenda + botón guardar en la misma fila -->
          <div class="flex items-center justify-between gap-4 flex-wrap">
            <p class="text-xs text-gray-400">
              Los datos se obtienen del
              <code class="bg-gray-100 px-1 py-0.5 rounded text-gray-500">localStorage</code>
              del navegador.
            </p>
            <button
              @click="handleSave"
              class="px-6 py-2.5 rounded-xl bg-brand-300 hover:bg-brand-400 text-brand-900 font-semibold text-sm transition-colors"
            >
              Guardar cambios
            </button>
          </div>
        </div>

        <!-- Pie: botón Cerrar sesión -->
        <div class="bg-gray-50 px-8 py-5 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap">
          <RouterLink
            to="/tasks"
            class="text-sm font-medium text-brand-400 hover:text-brand-900 transition-colors"
          >
            ← Volver a tareas
          </RouterLink>

          <button
            @click="handleLogout"
            class="px-5 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-sm font-semibold transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import { getUser, logout, updateUser } from '../services/auth'

const router   = useRouter()
const user     = ref(getUser())   // ref mutable para que el banner reaccione al guardar
const savedMsg = ref('')

// Formulario editable inicializado con los datos actuales del usuario
const form = reactive({
  fullName: user.value?.fullName ?? '',
  phone:    user.value?.phone    ?? '',
  alias:    user.value?.alias    ?? '',
})

const initials = computed(() => {
  const name = user.value?.fullName
  if (name) {
    return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')
  }
  return user.value?.email?.[0]?.toUpperCase() ?? '?'
})

function handleSave(): void {
  updateUser({ fullName: form.fullName, phone: form.phone, alias: form.alias })
  user.value = getUser()   // refresca el ref para que el banner se actualice
  savedMsg.value = 'Cambios guardados correctamente.'
  setTimeout(() => { savedMsg.value = '' }, 3000)
}

function handleLogout(): void {
  logout()
  router.push('/login')
}
</script>
