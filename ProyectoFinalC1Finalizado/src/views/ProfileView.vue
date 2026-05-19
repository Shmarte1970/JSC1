<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import AppHeader from '@/components/AppHeader.vue'
import AppMessage from '@/components/AppMessage.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import type { User } from '@/types'

const router  = useRouter()
const user    = ref<User | null>(null)
const loading = ref(false)
const msg     = ref<{ type: 'success' | 'error'; text: string } | null>(null)

const form = ref({ name: '', email: '', password: '' })

// Confirmación seed
const showSeedConfirm = ref(false)

// Confirmación estilo GitHub para eliminar datos
const deleteConfirmText = ref('')
const showDeleteZone    = ref(false)

const expectedDeleteText = computed(() => `Eliminar mis datos ${user.value?.email ?? ''}`)

const canDelete = computed(() =>
  deleteConfirmText.value.trim() === expectedDeleteText.value,
)

onMounted(async () => {
  try {
    user.value = await authService.getProfile()
    form.value.name  = user.value.name
    form.value.email = user.value.email
  } catch {
    router.push({ name: 'login' })
  }
})

async function saveProfile() {
  loading.value = true
  msg.value = null
  try {
    const payload: Record<string, string> = {}
    if (form.value.name  !== user.value?.name)  payload.name  = form.value.name
    if (form.value.email !== user.value?.email) payload.email = form.value.email
    if (form.value.password) payload.password = form.value.password

    if (Object.keys(payload).length === 0) {
      msg.value = { type: 'info' as any, text: 'No hay cambios que guardar.' }
      return
    }
    user.value = await authService.updateProfile(payload)
    form.value.password = ''
    msg.value = { type: 'success', text: 'Perfil actualizado correctamente.' }
  } catch (err: any) {
    msg.value = { type: 'error', text: err?.response?.data?.message ?? 'Error al guardar.' }
  } finally {
    loading.value = false
  }
}

async function resetData() {
  if (!canDelete.value) return
  showDeleteZone.value   = false
  deleteConfirmText.value = ''
  loading.value = true
  msg.value = null
  try {
    await authService.resetData()
    authService.logout()
    router.push({ name: 'login' })
  } catch (err: any) {
    msg.value = { type: 'error', text: err?.response?.data?.message ?? 'Error al eliminar datos.' }
    loading.value = false
  }
}

async function loadSeed() {
  showSeedConfirm.value = false
  loading.value = true
  msg.value = null
  try {
    await authService.loadSeedData()
    msg.value = { type: 'success', text: 'Datos de ejemplo cargados correctamente.' }
  } catch (err: any) {
    msg.value = { type: 'error', text: err?.response?.data?.message ?? 'Error al cargar datos de ejemplo.' }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />

    <main class="flex-1 max-w-2xl mx-auto w-full px-4 py-10 space-y-6">
      <h1>Mi perfil</h1>

      <AppMessage v-if="msg" :type="msg.type" :message="msg.text" @close="msg = null" />

      <!-- Datos del perfil -->
      <form class="card space-y-4" @submit.prevent="saveProfile">
        <h2 class="text-base font-semibold text-gray-700">Datos personales</h2>

        <!-- ID de usuario (solo lectura) -->
        <div v-if="user">
          <label class="label">Identificador</label>
          <p class="input bg-gray-50 text-gray-400 text-xs font-mono truncate select-all cursor-text">{{ user.id }}</p>
        </div>

        <div>
          <label class="label" for="p-name">Nombre</label>
          <input id="p-name" v-model="form.name" type="text" class="input" placeholder="Tu nombre" />
        </div>

        <div>
          <label class="label" for="p-email">Email</label>
          <input id="p-email" v-model="form.email" type="email" class="input" placeholder="tu@email.com" />
        </div>

        <div>
          <label class="label" for="p-password">
            Nueva contraseña
            <span class="text-gray-300 font-normal">(dejar vacío para no cambiar)</span>
          </label>
          <input id="p-password" v-model="form.password" type="password" class="input" placeholder="Mínimo 8 caracteres" />
        </div>

        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Guardando…' : 'Guardar cambios' }}
          </button>
        </div>
      </form>

      <!-- Cargar datos de ejemplo -->
      <div class="card space-y-3">
        <h2 class="text-base font-semibold text-gray-700">Datos de ejemplo</h2>
        <p class="text-sm text-gray-400">
          Carga un conjunto de productos y listas de prueba. Se borrarán los datos actuales.
        </p>
        <button class="btn btn-secondary" :disabled="loading" @click="showSeedConfirm = true">
          📦 Cargar datos de ejemplo
        </button>
      </div>

      <!-- Zona de peligro: eliminar mis datos -->
      <div class="rounded-2xl border border-red-200 bg-red-50 overflow-hidden">
        <!-- Cabecera zona de peligro -->
        <div class="px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <h2 class="text-base font-semibold text-red-700">Zona de peligro</h2>
            <p class="text-sm text-red-400 mt-0.5">Eliminar todos mis datos de forma permanente.</p>
          </div>
          <button
            class="btn btn-danger btn-sm flex-shrink-0"
            @click="showDeleteZone = !showDeleteZone; deleteConfirmText = ''"
          >
            {{ showDeleteZone ? 'Cancelar' : 'Eliminar mis datos' }}
          </button>
        </div>

        <!-- Formulario de confirmación estilo GitHub -->
        <div v-if="showDeleteZone" class="border-t border-red-200 px-5 py-5 bg-white space-y-4">
          <p class="text-sm text-gray-600">
            Esta acción <strong>no se puede deshacer</strong>. Se borrarán permanentemente todas tus
            listas de la compra y productos.
          </p>

          <div>
            <label class="label text-gray-700">
              Escribe
              <strong class="text-red-600 select-none">Eliminar mis datos {{ user?.email }}</strong>
              para confirmar
            </label>
            <input
              v-model="deleteConfirmText"
              type="text"
              class="input"
              :placeholder="expectedDeleteText"
              autocomplete="off"
            />
          </div>

          <button
            class="btn btn-danger w-full"
            :disabled="!canDelete || loading"
            @click="resetData"
          >
            {{ loading ? 'Eliminando…' : 'Sí, eliminar todos mis datos' }}
          </button>
        </div>
      </div>

      <!-- Cerrar sesión -->
      <div class="flex justify-end">
        <button
          class="btn btn-secondary"
          @click="authService.logout(); router.push({ name: 'login' })"
        >
          Cerrar sesión
        </button>
      </div>
    </main>

    <ConfirmDialog
      v-if="showSeedConfirm"
      title="Cargar datos de ejemplo"
      message="Se borrarán tus datos actuales y se cargarán datos de ejemplo. ¿Continuar?"
      confirm-label="Sí, cargar"
      @confirm="loadSeed"
      @cancel="showSeedConfirm = false"
    />
  </div>
</template>
