<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import { object, string, ref as yupRef } from 'yup'
import { authService } from '@/services/auth.service'
import AppMessage from '@/components/AppMessage.vue'

const router   = useRouter()
const apiError          = ref('')
const loading           = ref(false)
const showPassword      = ref(false)
const showConfirmPass   = ref(false)

const schema = object({
  name:            string().required('El nombre es obligatorio').min(2, 'Mínimo 2 caracteres'),
  email:           string().required('El email es obligatorio').email('Email no válido'),
  password:        string().required('La contraseña es obligatoria').min(8, 'Mínimo 8 caracteres'),
  confirmPassword: string()
    .required('Confirma tu contraseña')
    .oneOf([yupRef('password')], 'Las contraseñas no coinciden'),
})

const { handleSubmit } = useForm({ validationSchema: schema })
const { value: name,            errorMessage: nameError            } = useField<string>('name')
const { value: email,           errorMessage: emailError           } = useField<string>('email')
const { value: password,        errorMessage: passwordError        } = useField<string>('password')
const { value: confirmPassword, errorMessage: confirmPasswordError } = useField<string>('confirmPassword')

const onSubmit = handleSubmit(async (values) => {
  loading.value  = true
  apiError.value = ''
  try {
    await authService.register({ name: values.name, email: values.email, password: values.password })
    router.push({ name: 'lists' })
  } catch (err: any) {
    apiError.value = err?.response?.data?.message ?? 'Error al registrarse. Inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
    <div class="w-full max-w-md space-y-6">

      <!-- Logo -->
      <div class="text-center">
        <RouterLink :to="{ name: 'landing' }" class="text-3xl no-underline">🛒</RouterLink>
        <h1 class="mt-3 text-2xl font-bold text-gray-800">Crear cuenta</h1>
        <p class="text-sm text-gray-400 mt-1">
          ¿Ya tienes cuenta?
          <RouterLink :to="{ name: 'login' }" class="text-sage-500 font-medium hover:underline">Inicia sesión</RouterLink>
        </p>
      </div>

      <!-- Formulario -->
      <form class="card space-y-4" @submit.prevent="onSubmit">
        <AppMessage v-if="apiError" type="error" :message="apiError" @close="apiError = ''" />

        <div>
          <label class="label" for="name">Nombre completo</label>
          <input id="name" v-model="name" type="text"
            class="input" :class="{ 'input-error': nameError }"
            placeholder="Armando Bronca Segura" autocomplete="name"
          />
          <p v-if="nameError" class="error-msg">{{ nameError }}</p>
        </div>

        <div>
          <label class="label" for="email">Email</label>
          <input id="email" v-model="email" type="email"
            class="input" :class="{ 'input-error': emailError }"
            placeholder="tu@email.com" autocomplete="email"
          />
          <p v-if="emailError" class="error-msg">{{ emailError }}</p>
        </div>

        <div>
          <label class="label" for="password">Contraseña</label>
          <div class="relative">
            <input id="password" v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="input pr-10" :class="{ 'input-error': passwordError }"
              placeholder="Mínimo 8 caracteres" autocomplete="new-password"
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

        <div>
          <label class="label" for="confirm">Confirmar contraseña</label>
          <div class="relative">
            <input id="confirm" v-model="confirmPassword"
              :type="showConfirmPass ? 'text' : 'password'"
              class="input pr-10" :class="{ 'input-error': confirmPasswordError }"
              placeholder="Repite la contraseña" autocomplete="new-password"
            />
            <button type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              :aria-label="showConfirmPass ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              @click="showConfirmPass = !showConfirmPass"
            >
              <svg v-if="showConfirmPass" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
          <p v-if="confirmPasswordError" class="error-msg">{{ confirmPasswordError }}</p>
        </div>

        <button type="submit" class="btn btn-primary w-full" :disabled="loading">
          <span v-if="loading">Creando cuenta…</span>
          <span v-else>Crear cuenta</span>
        </button>
      </form>
    </div>
  </div>
</template>
