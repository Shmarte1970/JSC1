<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <main class="max-w-5xl mx-auto px-6 py-8">

      <!-- Cabecera -->
      <div class="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 class="text-2xl font-bold text-brand-900">Mis tareas</h2>
          <p class="text-brand-400 text-sm mt-0.5">
            {{ displayedTasks.length }} tarea{{ displayedTasks.length !== 1 ? 's' : '' }}
            <span v-if="searchQuery || hasActiveFilters"> filtradas de {{ tasks.length }}</span>
          </p>
        </div>
      </div>

      <!-- ── Formulario Nueva tarea ─────────────────────────────────────────── -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Nueva tarea
        </h3>
        <div class="space-y-3">

          <!-- Nombre -->
          <input
            v-model="newTask.name"
            type="text"
            placeholder="Nombre de la tarea..."
            class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition"
          />

          <!-- Descripción -->
          <textarea
            v-model="newTask.description"
            placeholder="Descripción breve de la tarea..."
            rows="2"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition resize-none"
          ></textarea>

          <!-- Fecha + Prioridad + Crear -->
          <div class="flex gap-3 flex-wrap items-center">
            <input
              v-model="newTask.dueDate"
              type="date"
              class="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition"
            />
            <select
              v-model="newTask.priority"
              class="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition bg-white"
            >
              <option value="low">Prioridad baja</option>
              <option value="medium">Prioridad media</option>
              <option value="high">Prioridad alta</option>
            </select>
            <button
              @click="crearTarea"
              :disabled="!newTask.name.trim()"
              class="px-5 py-2.5 rounded-xl bg-brand-300 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-brand-900 text-sm font-semibold transition-colors"
            >
              Crear tarea
            </button>
          </div>

        </div>
      </div>

      <!-- ── Barra de controles ─────────────────────────────────────────────── -->
      <div class="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">

        <!-- Ejercicio 2: Buscador -->
        <div class="relative flex-1 max-w-md">
          <span class="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
            🔍
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre o descripción..."
            class="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent transition"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <!-- Ejercicio 3: Botón Filtros + Ejercicio 4: Vista -->
        <div class="flex gap-2 shrink-0">

          <!-- Botón panel de filtros -->
          <button
            @click="filterPanelOpen = !filterPanelOpen"
            :class="[
              'flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors',
              hasActiveFilters
                ? 'bg-brand-300 border-brand-300 text-brand-900'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            ]"
          >
            Filtros
            <span
              v-if="hasActiveFilters"
              class="bg-brand-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
            >
              {{ activeFiltersCount }}
            </span>
            <span class="text-xs">{{ filterPanelOpen ? '▲' : '▼' }}</span>
          </button>

          <!-- Ejercicio 4: Toggle lista / tarjetas -->
          <button
            @click="toggleView"
            class="px-3 py-2.5 rounded-xl text-sm font-medium border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {{ viewMode === 'list' ? 'Vista tarjetas' : 'Vista lista' }}
          </button>

        </div>
      </div>

      <!-- ── Ejercicio 3: Panel de filtros ─────────────────────────────────── -->
      <div
        v-if="filterPanelOpen"
        class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4"
      >
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Ordenar tareas
        </p>
        <div class="flex flex-col sm:flex-row gap-6">

          <!-- Ordenar por fecha límite -->
          <div>
            <p class="text-xs font-medium text-gray-600 mb-2">Fecha límite</p>
            <div class="flex gap-1.5">
              <button
                @click="setDateSort('asc')"
                :class="[
                  'px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors',
                  dateSort === 'asc'
                    ? 'bg-brand-300 border-brand-300 text-brand-900'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                ]"
              >
                ↑ Más antigua
              </button>
              <button
                @click="setDateSort('desc')"
                :class="[
                  'px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors',
                  dateSort === 'desc'
                    ? 'bg-brand-300 border-brand-300 text-brand-900'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                ]"
              >
                ↓ Más reciente
              </button>
              <button
                v-if="dateSort"
                @click="dateSort = null"
                class="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Ordenar por prioridad -->
          <div>
            <p class="text-xs font-medium text-gray-600 mb-2">Prioridad</p>
            <div class="flex gap-1.5">
              <button
                @click="setPrioritySort('desc')"
                :class="[
                  'px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors',
                  prioritySort === 'desc'
                    ? 'bg-brand-300 border-brand-300 text-brand-900'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                ]"
              >
                ↓ Mayor a menor
              </button>
              <button
                @click="setPrioritySort('asc')"
                :class="[
                  'px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors',
                  prioritySort === 'asc'
                    ? 'bg-brand-300 border-brand-300 text-brand-900'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                ]"
              >
                ↑ Menor a mayor
              </button>
              <button
                v-if="prioritySort"
                @click="prioritySort = null"
                class="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Limpiar todo -->
          <div class="flex items-end">
            <button
              v-if="hasActiveFilters"
              @click="clearAllFilters"
              class="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            >
              Limpiar orden
            </button>
          </div>

        </div>

        <!-- Chips de filtros activos -->
        <div v-if="hasActiveFilters" class="mt-4 pt-3 border-t border-gray-100 flex gap-2 flex-wrap items-center">
          <span
            v-if="nameSort"
            class="inline-flex items-center gap-1 bg-brand-100 text-brand-900 text-xs font-medium px-2.5 py-1 rounded-full"
          >
            Tarea {{ nameSort === 'asc' ? '↑ A→Z' : '↓ Z→A' }}
            <button @click="nameSort = null" class="ml-0.5 hover:text-brand-400">✕</button>
          </span>
          <span
            v-if="prioritySort"
            class="inline-flex items-center gap-1 bg-brand-100 text-brand-900 text-xs font-medium px-2.5 py-1 rounded-full"
          >
            Prioridad {{ prioritySort === 'desc' ? '↓ Mayor a menor' : '↑ Menor a mayor' }}
            <button @click="prioritySort = null" class="ml-0.5 hover:text-brand-400">✕</button>
          </span>
          <span
            v-if="dateSort"
            class="inline-flex items-center gap-1 bg-brand-100 text-brand-900 text-xs font-medium px-2.5 py-1 rounded-full"
          >
            Fecha {{ dateSort === 'asc' ? '↑ Más antigua' : '↓ Más reciente' }}
            <button @click="dateSort = null" class="ml-0.5 hover:text-brand-400">✕</button>
          </span>
        </div>
      </div>

      <!-- ── Botones de acción sobre las tareas ─────────────────────────────── -->
      <div class="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div class="flex gap-2">
          <button
            @click="completarTodas"
            class="px-3 py-2 rounded-xl text-xs font-semibold border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
          >
            Completar todas
          </button>
          <button
            @click="eliminarCompletadas"
            class="px-3 py-2 rounded-xl text-xs font-semibold border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            Eliminar completadas
          </button>
        </div>
        <button
          @click="recargar"
          class="px-3 py-2 rounded-xl text-xs font-semibold border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ↺ Recargar
        </button>
      </div>

      <!-- ── Sin resultados (Ejercicio 2) ──────────────────────────────────── -->
      <div
        v-if="displayedTasks.length === 0"
        class="bg-white rounded-xl border border-gray-200 py-16 text-center"
      >
        <p class="text-gray-400 text-lg mb-1">Sin resultados</p>
        <p class="text-gray-400 text-sm">
          No hay tareas que coincidan con
          <strong>«{{ searchQuery }}»</strong>.
        </p>
        <button
          @click="searchQuery = ''"
          class="mt-4 text-sm text-brand-400 hover:text-brand-900 font-medium transition-colors"
        >
          Limpiar búsqueda
        </button>
      </div>

      <!-- ── Vista lista (Ejercicio 4) ─────────────────────────────────────── -->
      <template v-else-if="viewMode === 'list'">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                <th class="px-4 py-3 text-left">Estado</th>
                <th
                  class="px-4 py-3 text-left cursor-pointer select-none hover:bg-gray-200 transition-colors"
                  @click="toggleColumnSort('priority')"
                >
                  <span class="flex items-center gap-1">
                    Prioridad
                    <span :class="prioritySort ? 'text-brand-900' : 'text-gray-300'">
                      {{ columnArrow('priority') }}
                    </span>
                  </span>
                </th>
                <th
                  class="px-4 py-3 text-left cursor-pointer select-none hover:bg-gray-200 transition-colors"
                  @click="toggleColumnSort('name')"
                >
                  <span class="flex items-center gap-1">
                    Tarea
                    <span :class="nameSort ? 'text-brand-900' : 'text-gray-300'">
                      {{ columnArrow('name') }}
                    </span>
                  </span>
                </th>
                <th class="px-4 py-3 text-left hidden md:table-cell">Descripción</th>
                <th
                  class="px-4 py-3 text-left whitespace-nowrap cursor-pointer select-none hover:bg-gray-200 transition-colors"
                  @click="toggleColumnSort('dueDate')"
                >
                  <span class="flex items-center gap-1">
                    Fecha límite
                    <span :class="dateSort ? 'text-brand-900' : 'text-gray-300'">
                      {{ columnArrow('dueDate') }}
                    </span>
                  </span>
                </th>
                <th class="px-4 py-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="task in displayedTasks"
                :key="task.id"
                :class="[
                  'border-t border-gray-100 transition-colors',
                  task.status === 'done'
                    ? 'bg-gray-50 opacity-60'
                    : 'hover:bg-brand-50'
                ]"
              >
                <!-- Estado -->
                <td class="px-4 py-3 whitespace-nowrap">
                  <span :class="statusClass(task.status)">
                    {{ statusLabel(task.status) }}
                  </span>
                </td>
                <!-- Prioridad -->
                <td class="px-4 py-3">
                  <span :class="priorityClass(task.priority)">
                    {{ priorityLabel(task.priority) }}
                  </span>
                </td>
                <!-- Nombre -->
                <td
                  class="px-4 py-3 font-medium text-gray-800"
                  :class="{ 'line-through text-gray-400': task.status === 'done' }"
                >
                  {{ task.name }}
                </td>
                <!-- Descripción -->
                <td class="px-4 py-3 text-gray-500 hidden md:table-cell max-w-xs">
                  <span class="block truncate">{{ task.description }}</span>
                </td>
                <!-- Fecha -->
                <td class="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {{ task.dueDate ? formatDate(task.dueDate) : '—' }}
                </td>
                <!-- Acción: toggle estado -->
                <td class="px-4 py-3 text-center">
                  <button
                    @click="toggleTaskStatus(task.id)"
                    :class="[
                      'w-7 h-7 rounded-lg border text-xs font-bold transition-colors',
                      task.status === 'done'
                        ? 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200'
                        : 'bg-white border-gray-300 text-gray-400 hover:border-brand-300 hover:text-brand-400'
                    ]"
                    :title="task.status === 'done' ? 'Marcar como pendiente' : 'Marcar como hecha'"
                  >
                    ✓
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- ── Vista tarjetas (Ejercicio 4) ──────────────────────────────────── -->
      <template v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="task in displayedTasks"
            :key="task.id"
            :class="[
              'bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col gap-3 transition-shadow',
              task.status === 'done' ? 'opacity-60' : 'hover:shadow-md'
            ]"
          >
            <!-- Cabecera tarjeta: prioridad + estado -->
            <div class="flex items-center justify-between">
              <span :class="priorityClass(task.priority)">
                {{ priorityLabel(task.priority) }}
              </span>
              <span :class="statusClass(task.status)">
                {{ statusLabel(task.status) }}
              </span>
            </div>

            <!-- Nombre -->
            <h3
              class="font-semibold text-gray-800 leading-tight"
              :class="{ 'line-through text-gray-400': task.status === 'done' }"
            >
              {{ task.name }}
            </h3>

            <!-- Descripción -->
            <p class="text-sm text-gray-500 leading-relaxed flex-1">
              {{ task.description }}
            </p>

            <!-- Pie tarjeta: fecha + toggle -->
            <div class="flex items-center justify-between pt-2 border-t border-gray-100">
              <span class="text-xs text-gray-400">
                {{ task.dueDate ? formatDate(task.dueDate) : '—' }}
              </span>
              <button
                @click="toggleTaskStatus(task.id)"
                :class="[
                  'w-7 h-7 rounded-lg border text-xs font-bold transition-colors',
                  task.status === 'done'
                    ? 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200'
                    : 'bg-white border-gray-300 text-gray-400 hover:border-brand-300 hover:text-brand-400'
                ]"
                :title="task.status === 'done' ? 'Marcar como pendiente' : 'Marcar como hecha'"
              >
                ✓
              </button>
            </div>
          </div>
        </div>
      </template>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import tasksData from '../data/tasks.json'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Task {
  id:          number
  name:        string
  description: string
  dueDate:     string
  priority:    'low' | 'medium' | 'high'
  status:      'pending' | 'done'
}

type SortDir  = 'asc' | 'desc' | null
type ViewMode = 'list' | 'cards'

// ─── Datos iniciales ──────────────────────────────────────────────────────────

const INITIAL_TASKS: Task[] = (tasksData as Omit<Task, 'status'>[]).map(t => ({
  ...t,
  status: 'pending' as const,
}))

// ─── Estado ───────────────────────────────────────────────────────────────────

// Tareas reactivas (pueden crearse, completarse, eliminarse)
const tasks = ref<Task[]>(INITIAL_TASKS.map(t => ({ ...t })))

// Formulario nueva tarea
const newTask = ref({
  name:        '',
  description: '',
  dueDate:     '',
  priority:    'medium' as Task['priority'],
})

// Ejercicio 2: buscador
const searchQuery = ref('')

// Ejercicio 3: panel de filtros/orden
const filterPanelOpen = ref(false)
const dateSort         = ref<SortDir>(null)
const prioritySort     = ref<SortDir>(null)
const nameSort         = ref<SortDir>(null)

// Ejercicio 4: vista
const viewMode = ref<ViewMode>('list')

// Pesos de prioridad para el sort
const PRIORITY_WEIGHT: Record<Task['priority'], number> = {
  low: 1, medium: 2, high: 3,
}

// ─── Computed ─────────────────────────────────────────────────────────────────

/** Ejercicio 2: filtra por nombre o descripción (case-insensitive) */
const filteredTasks = computed<Task[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return tasks.value
  return tasks.value.filter(
    t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
  )
})

/** Ejercicio 3: ordena los resultados filtrados */
const displayedTasks = computed<Task[]>(() => {
  if (!nameSort.value && !prioritySort.value && !dateSort.value) return filteredTasks.value

  return [...filteredTasks.value].sort((a, b) => {
    if (nameSort.value) {
      const cmp = a.name.localeCompare(b.name, 'es')
      if (cmp !== 0) return nameSort.value === 'asc' ? cmp : -cmp
    }
    if (prioritySort.value) {
      const wA = PRIORITY_WEIGHT[a.priority]
      const wB = PRIORITY_WEIGHT[b.priority]
      if (wA !== wB) return prioritySort.value === 'asc' ? wA - wB : wB - wA
    }
    if (dateSort.value) {
      const dA = a.dueDate ? new Date(a.dueDate).getTime() : 0
      const dB = b.dueDate ? new Date(b.dueDate).getTime() : 0
      return dateSort.value === 'asc' ? dA - dB : dB - dA
    }
    return 0
  })
})

const activeFiltersCount = computed(() =>
  (nameSort.value ? 1 : 0) + (prioritySort.value ? 1 : 0) + (dateSort.value ? 1 : 0)
)
const hasActiveFilters = computed(() => activeFiltersCount.value > 0)

// ─── Métodos: gestión de tareas ───────────────────────────────────────────────

/** Añade una nueva tarea al inicio de la lista */
function crearTarea(): void {
  if (!newTask.value.name.trim()) return
  tasks.value.unshift({
    id:          Date.now(),
    name:        newTask.value.name.trim(),
    description: newTask.value.description.trim(),
    dueDate:     newTask.value.dueDate,
    priority:    newTask.value.priority,
    status:      'pending',
  })
  newTask.value = { name: '', description: '', dueDate: '', priority: 'medium' }
}

/** Alterna el estado de una tarea entre pending y done */
function toggleTaskStatus(id: number): void {
  const task = tasks.value.find(t => t.id === id)
  if (task) task.status = task.status === 'pending' ? 'done' : 'pending'
}

/** Marca todas las tareas visibles como completadas */
function completarTodas(): void {
  tasks.value.forEach(t => { t.status = 'done' })
}

/** Elimina todas las tareas con estado done */
function eliminarCompletadas(): void {
  tasks.value = tasks.value.filter(t => t.status !== 'done')
}

/** Restaura la lista original desde el JSON */
function recargar(): void {
  tasks.value    = INITIAL_TASKS.map(t => ({ ...t }))
  searchQuery.value  = ''
  clearAllFilters()
}

// ─── Métodos: ordenación ──────────────────────────────────────────────────────

function setDateSort(dir: 'asc' | 'desc'): void {
  dateSort.value = dateSort.value === dir ? null : dir
}

function setPrioritySort(dir: 'asc' | 'desc'): void {
  prioritySort.value = prioritySort.value === dir ? null : dir
}

function toggleColumnSort(col: 'name' | 'priority' | 'dueDate'): void {
  const cycle: Record<string, SortDir> = { null: 'asc', asc: 'desc', desc: null }
  if (col === 'name')     nameSort.value     = cycle[String(nameSort.value)]     as SortDir
  else if (col === 'priority') prioritySort.value = cycle[String(prioritySort.value)] as SortDir
  else                    dateSort.value     = cycle[String(dateSort.value)]     as SortDir
}

function columnArrow(col: 'name' | 'priority' | 'dueDate'): string {
  const v = col === 'name' ? nameSort.value : col === 'priority' ? prioritySort.value : dateSort.value
  return v === 'asc' ? '↑' : v === 'desc' ? '↓' : '↕'
}

function clearAllFilters(): void {
  nameSort.value     = null
  prioritySort.value = null
  dateSort.value     = null
}

function toggleView(): void {
  viewMode.value = viewMode.value === 'list' ? 'cards' : 'list'
}

// ─── Helpers de presentación ──────────────────────────────────────────────────

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function statusLabel(s: Task['status']): string {
  return s === 'done' ? 'Hecha' : 'Pendiente'
}

function statusClass(s: Task['status']): string {
  return s === 'done'
    ? 'text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700'
    : 'text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700'
}

function priorityLabel(p: Task['priority']): string {
  return { low: 'Baja', medium: 'Media', high: 'Alta' }[p]
}

function priorityClass(p: Task['priority']): string {
  return {
    low:    'text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600',
    medium: 'text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700',
    high:   'text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700',
  }[p]
}
</script>
