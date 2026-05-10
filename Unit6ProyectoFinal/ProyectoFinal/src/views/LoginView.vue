<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-sm">

      <!-- Cabecera del formulario -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-brand-900">Gestión de Tareas</h1>
        <p class="text-gray-500 text-sm mt-1">Inicia sesión para continuar</p>
      </div>

      <!-- Tarjeta del formulario -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <form @submit.prevent="handleLogin" novalidate>

          <!-- Identificador (email o nombre completo) -->
          <div class="mb-5">
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">
              Correo electrónico o nombre completo
            </label>
            <input
              v-model="identifier"
              type="text"
              placeholder="correo@ejemplo.com o Nombre Apellido"
              autocomplete="username"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent transition"
            />
          </div>

          <!-- Contraseña con toggle de visibilidad -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">
              Contraseña
            </label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="current-password"
                class="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent transition"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 transition-colors"
                :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              >
                <!-- Ojo abierto -->
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <!-- Ojo tachado -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Error -->
          <p
            v-if="errorMsg"
            class="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
          >
            {{ errorMsg }}
          </p>

          <!-- Botón enviar -->
          <button
            type="submit"
            :disabled="!identifier || !password"
            class="w-full bg-brand-300 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-brand-900 font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            Iniciar sesión
          </button>
        </form>

        <!-- Credenciales de prueba -->
        <div class="mt-6 pt-5 border-t border-gray-100">
          <p class="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">
            Usuarios de prueba
          </p>
          <div class="space-y-1.5">
            <button
              v-for="u in USERS"
              :key="u.email"
              @click="fillCredentials(u.email, u.password)"
              class="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-brand-50 transition-colors text-xs"
            >
              <span class="font-medium text-gray-700">{{ u.fullName }}</span>
              <span class="text-gray-400 ml-1">— {{ u.email }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, USERS } from '../services/auth'

const router       = useRouter()
const identifier   = ref('')
const password     = ref('')
const errorMsg     = ref('')
const showPassword = ref(false)

function fillCredentials(e: string, p: string): void {
  identifier.value = e
  password.value   = p
  errorMsg.value   = ''
}

function handleLogin(): void {
  errorMsg.value = ''
  if (!identifier.value || !password.value) return

  const ok = login(identifier.value, password.value)
  if (ok) {
    router.push('/tasks')
  } else {
    errorMsg.value = 'Credenciales incorrectas. Prueba con correo, nombre completo o los usuarios de ejemplo.'
  }
}
</script>
