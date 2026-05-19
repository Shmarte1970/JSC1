<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import { object, string } from 'yup'
import { authService } from '@/services/auth.service'
import AppMessage from '@/components/AppMessage.vue'
import clientesData from '@/data/clientes.json'

const router = useRouter()
const apiError     = ref('')
const loading        = ref(false)
const showPassword   = ref(false)
const showForgotMsg  = ref(false)

const schema = object({
  email:    string().required('El email es obligatorio').email('Email no válido'),
  password: string().required('La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres'),
})

const { handleSubmit } = useForm({ validationSchema: schema })
const { value: email,    errorMessage: emailError    } = useField<string>('email')
const { value: password, errorMessage: passwordError } = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
  loading.value  = true
  apiError.value = ''
  try {
    await authService.login({ email: values.email, password: values.password })
    router.push({ name: 'lists' })
  } catch (err: any) {
    apiError.value = err?.response?.data?.message ?? 'Credenciales incorrectas'
  } finally {
    loading.value = false
  }
})

function fillUser(cliente: typeof clientesData[0]) {
  email.value    = cliente.email
  password.value = cliente.password
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
    <div class="w-full max-w-md space-y-6">

      <!-- Logo -->
      <div class="text-center">
        <RouterLink :to="{ name: 'landing' }" class="text-3xl no-underline">🛒</RouterLink>
        <h1 class="mt-3 text-2xl font-bold text-gray-800">Iniciar sesión</h1>
        <p class="text-sm text-gray-400 mt-1">
          ¿No tienes cuenta?
          <RouterLink :to="{ name: 'register' }" class="text-sage-500 font-medium hover:underline">Regístrate</RouterLink>
        </p>
      </div>

      <!-- Formulario -->
      <form class="card space-y-4" @submit.prevent="onSubmit">
        <AppMessage v-if="apiError" type="error" :message="apiError" @close="apiError = ''" />

        <div>
          <label class="label" for="email">Email</label>
          <input
            id="email" v-model="email" type="email"
            class="input" :class="{ 'input-error': emailError }"
            placeholder="tu@email.com" autocomplete="email"
          />
          <p v-if="emailError" class="error-msg">{{ emailError }}</p>
        </div>

        <div>
          <label class="label" for="password">Contraseña</label>
          <div class="relative">
            <input
              id="password" v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="input pr-10" :class="{ 'input-error': passwordError }"
              placeholder="••••••••" autocomplete="current-password"
            />
            <button type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              @click="showPassword = !showPassword"
            >
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
          <p v-if="passwordError" class="error-msg">{{ passwordError }}</p>
        </div>

        <!-- Recuérdame + ¿Olvidaste la contraseña? -->
        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 cursor-pointer select-none text-gray-600">
            <input type="checkbox" class="rounded border-gray-300 text-sage-500 focus:ring-sage-400" />
            Recuérdame
          </label>
          <button
            type="button"
            class="text-sage-500 hover:underline"
            @click="showForgotMsg = !showForgotMsg"
          >
            ¿Olvidaste la contraseña?
          </button>
        </div>
        <p v-if="showForgotMsg" class="text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
          Inicia sesión con tu contraseña actual y ve a <strong>Perfil → Datos personales</strong> para cambiarla.
        </p>

        <button type="submit" class="btn btn-primary w-full" :disabled="loading">
          <span v-if="loading">Entrando…</span>
          <span v-else>Iniciar sesión</span>
        </button>
      </form>

      <!-- Usuarios de prueba -->
      <details class="card">
        <summary class="text-sm font-medium text-gray-600 cursor-pointer select-none">
          Usuarios de prueba — clic en un usuario para rellenar el formulario
        </summary>
        <p class="text-xs text-amber-600 mt-2 bg-amber-50 rounded-lg px-3 py-2">
          ⚠️ Primero debes <strong>registrar</strong> al usuario en la API. Luego podrás iniciar sesión.
        </p>
        <div class="mt-2 space-y-1">
          <button
            v-for="c in clientesData" :key="c.id" type="button"
            class="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            @click="fillUser(c)"
          >
            <p class="text-sm font-medium text-gray-700">{{ c.nombre }} {{ c.apellidos }}</p>
            <p class="text-xs text-gray-400">{{ c.email }} · <span class="font-mono">{{ c.password }}</span></p>
          </button>
        </div>
      </details>
    </div>
  </div>
</template>
