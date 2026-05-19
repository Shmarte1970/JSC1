<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listsService } from '@/services/lists.service'
import AppHeader from '@/components/AppHeader.vue'
import AppMessage from '@/components/AppMessage.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import type { ShoppingList } from '@/types'

const router = useRouter()
const lists        = ref<ShoppingList[]>([])
const search       = ref('')
const loading      = ref(true)   // true inicial: evita flash de "sin listas"
const msg          = ref<{ type: 'success' | 'error'; text: string } | null>(null)
const showForm     = ref(false)
const listToDelete = ref<ShoppingList | null>(null)
// IDs de listas cuyos ítems ya han sido cargados en background
const enrichedIds  = ref<string[]>([])

// Fecha de hoy en formato ISO para el campo date
const todayISO = (): string => new Date().toISOString().split('T')[0] ?? ''

const newList = ref<{ title: string; date: string }>({ title: '', date: todayISO() })

// Edición inline de lista
const listToEdit = ref<ShoppingList | null>(null)
const editForm   = ref({ title: '', date: '' })

const filtered = computed(() =>
  lists.value.filter((l) => l.title.toLowerCase().includes(search.value.toLowerCase())),
)

onMounted(loadLists)

async function loadLists() {
  loading.value = true
  try {
    lists.value = await listsService.getAll()
  } catch (err: any) {
    // 404 = sin listas aún → vacío, no error
    if (err?.response?.status === 404) {
      lists.value = []
    } else {
      msg.value = { type: 'error', text: 'Error al cargar las listas.' }
    }
  } finally {
    loading.value = false
  }

  // Enriquecer cada lista con sus ítems en paralelo (background)
  if (lists.value.length > 0) {
    await Promise.allSettled(
      lists.value.map(async (l) => {
        try {
          const full = await listsService.getById(l.id)
          const idx = lists.value.findIndex((x) => x.id === l.id)
          if (idx !== -1) lists.value[idx] = full
          enrichedIds.value = [...enrichedIds.value, l.id]
        } catch { /* ignorar si falla el detalle de una lista */ }
      }),
    )
  }
}

async function createList() {
  if (loading.value) return            // evita doble submit (Enter + botón simultáneos)
  if (!newList.value.title.trim()) return
  loading.value = true
  try {
    const created = await listsService.create({
      title: newList.value.title,
      date:  newList.value.date || todayISO(),
    })
    lists.value.unshift(created)
    newList.value = { title: '', date: todayISO() }
    showForm.value = false
    msg.value = { type: 'success', text: `Lista "${created.title}" creada.` }
  } catch (err: any) {
    const detail = err?.response?.data?.message ?? err?.response?.data
    msg.value = { type: 'error', text: Array.isArray(detail) ? detail.join(', ') : (detail ?? 'Error al crear la lista.') }
  } finally {
    loading.value = false
  }
}

function openEdit(list: ShoppingList) {
  listToEdit.value = list
  editForm.value   = { title: list.title, date: list.date }
}

async function saveList() {
  if (!listToEdit.value || !editForm.value.title.trim()) return
  const id = listToEdit.value.id
  loading.value = true
  try {
    await listsService.update(id, {
      title: editForm.value.title,
      date:  editForm.value.date,
    })
    // Actualiza el título y la fecha localmente (la API puede no devolver todos los campos)
    const idx = lists.value.findIndex((l) => l.id === id)
    const item = idx !== -1 ? lists.value[idx] : undefined
    if (item) {
      item.title = editForm.value.title
      item.date  = editForm.value.date
    }
    listToEdit.value = null
    msg.value = { type: 'success', text: 'Lista actualizada.' }
  } catch (err: any) {
    const detail = err?.response?.data?.message ?? err?.response?.data
    msg.value = { type: 'error', text: Array.isArray(detail) ? detail.join(', ') : (detail ?? 'Error al actualizar la lista.') }
  } finally {
    loading.value = false
  }
}

async function removeList() {
  if (!listToDelete.value) return
  const id = listToDelete.value.id
  listToDelete.value = null
  loading.value = true
  try {
    // La API no hace cascade → borramos los ítems primero
    try {
      const full = await listsService.getById(id)
      for (const item of (full.items ?? [])) {
        await listsService.removeItem(id, item.id)
      }
    } catch { /* si falla el getById lo intentamos igualmente */ }

    await listsService.remove(id)
    lists.value = lists.value.filter((l) => l.id !== id)
    msg.value = { type: 'success', text: 'Lista eliminada.' }
  } catch (err: any) {
    msg.value = { type: 'error', text: err?.response?.data?.message ?? 'Error al eliminar la lista.' }
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}


</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />

    <main class="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-6">

      <!-- Cabecera -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1>Mis listas de la compra</h1>
          <p v-if="!loading" class="text-sm text-gray-400 mt-1">
            <span class="badge badge-gray">Listas: {{ lists.length }}</span>
          </p>
        </div>
        <button class="btn btn-primary" @click="showForm = !showForm">
          {{ showForm ? '✕ Cancelar' : '+ Nueva lista' }}
        </button>
      </div>

      <AppMessage v-if="msg" :type="msg.type" :message="msg.text" @close="msg = null" />

      <!-- Formulario nueva lista -->
      <div v-if="showForm" class="card space-y-4">
        <h2 class="text-base font-semibold text-gray-700">Nueva lista</h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="label">Título *</label>
            <input
              v-model="newList.title"
              type="text"
              class="input"
              placeholder="Ej: Compra semanal"
              maxlength="80"
              @keyup.enter="createList"
            />
          </div>
          <div>
            <label class="label">Fecha *</label>
            <input v-model="newList.date" type="date" class="input" />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button class="btn btn-secondary" @click="showForm = false; newList = { title: '', date: todayISO() }">Cancelar</button>
          <button class="btn btn-primary" :disabled="loading || !newList.title.trim()" @click="createList">
            Crear lista
          </button>
        </div>
      </div>

      <!-- Buscador -->
      <input v-model="search" type="search" class="input" placeholder="Buscar lista por título…" />

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12 text-gray-400">Cargando…</div>

      <!-- Sin listas -->
      <div v-else-if="filtered.length === 0" class="text-center py-16 text-gray-400">
        <div class="text-5xl mb-3">📋</div>
        <p class="font-medium">{{ search ? `No hay listas que coincidan con "${search}"` : 'Aún no tienes listas' }}</p>
        <p class="text-sm mt-1">{{ !search ? 'Crea tu primera lista de la compra.' : '' }}</p>
      </div>

      <!-- Grid de listas -->
      <div v-else class="grid sm:grid-cols-2 gap-4">
        <div
          v-for="list in filtered"
          :key="list.id"
          class="flex flex-col gap-3"
        >
          <!-- Modo edición inline (null-safe: sin listToEdit nunca coincide) -->
          <div v-if="listToEdit !== null && listToEdit.id === list.id" class="card space-y-3 ring-2 ring-sage-300">
            <h3 class="text-sm font-semibold text-gray-700">Editar lista</h3>
            <div class="grid sm:grid-cols-2 gap-3">
              <div>
                <label class="label">Título *</label>
                <input
                  v-model="editForm.title"
                  type="text"
                  class="input"
                  maxlength="80"
                  @keyup.enter="saveList"
                />
              </div>
              <div>
                <label class="label">Fecha</label>
                <input v-model="editForm.date" type="date" class="input" />
              </div>
            </div>
            <div class="flex gap-2 justify-end">
              <button class="btn btn-secondary btn-sm" @click="listToEdit = null">Cancelar</button>
              <button class="btn btn-primary btn-sm" :disabled="loading || !editForm.title.trim()" @click="saveList">
                Guardar
              </button>
            </div>
          </div>

          <!-- Tarjeta normal -->
          <div v-else class="card flex flex-col gap-3">
            <!-- Cabecera: título + acciones inline -->
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-800 truncate">{{ list.title }}</h3>
                <p class="text-xs text-gray-400 mt-0.5">📅 {{ formatDate(list.date) }}</p>
              </div>
              <div class="flex gap-1 flex-shrink-0">
                <button class="btn btn-secondary btn-sm" @click.stop="openEdit(list)" aria-label="Editar lista">✏️</button>
                <button class="btn btn-danger btn-sm" @click.stop="listToDelete = list" aria-label="Eliminar lista">🗑</button>
              </div>
            </div>

            <!-- Stats (se rellenan en background tras cargar detalle) -->
            <div class="flex items-center gap-4 text-sm pt-2 border-t border-gray-100">
              <template v-if="enrichedIds.includes(list.id)">
                <span class="text-gray-500">📦 {{ list.items.length }} producto{{ list.items.length !== 1 ? 's' : '' }}</span>
                <span class="font-semibold text-sage-600 ml-auto">
                  {{ list.items.reduce((s, i) => s + i.quantity * i.price, 0).toFixed(2) }} €
                </span>
              </template>
              <template v-else>
                <span class="text-gray-300 text-xs animate-pulse">cargando estadísticas…</span>
              </template>
            </div>

            <!-- Botones de acción -->
            <div class="flex gap-2 pt-1">
              <button
                class="btn btn-secondary btn-sm flex-1"
                @click="router.push({ name: 'list-detail', params: { id: list.id } })"
              >
                Ver lista →
              </button>
              <button
                class="btn btn-primary btn-sm flex-1"
                @click="router.push({ name: 'list-detail', params: { id: list.id }, query: { add: '1' } })"
              >
                + Añadir producto
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <ConfirmDialog
      v-if="listToDelete"
      title="Eliminar lista"
      :message="`¿Eliminar la lista '${listToDelete.title}'? Esta acción no se puede deshacer.`"
      confirm-label="Sí, eliminar"
      :danger="true"
      @confirm="removeList"
      @cancel="listToDelete = null"
    />
  </div>
</template>
