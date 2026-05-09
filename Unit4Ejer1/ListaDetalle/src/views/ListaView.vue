<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Cabecera -->
    <header class="bg-brand-200 shadow-md">
      <div class="max-w-5xl mx-auto px-6 py-5">
        <h1 class="text-2xl font-bold text-brand-900 tracking-tight">
          Listado de Alumnos
        </h1>
        <p class="text-brand-400 text-sm mt-1">
          {{ alumnosFiltrados.length }} alumno{{ alumnosFiltrados.length !== 1 ? 's' : '' }} encontrado{{ alumnosFiltrados.length !== 1 ? 's' : '' }}
        </p>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-8">
      <!-- Buscador -->
      <div class="mb-5 w-3/4">
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Búsqueda rápida
        </label>
        <div class="relative">
          <span class="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
            🔍
          </span>
          <input
            v-model="termino"
            type="text"
            placeholder="Escribe un nombre..."
            class="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent transition"
          />
          <button
            v-if="termino"
            @click="termino = ''"
            class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <p class="text-xs text-gray-400 mt-1.5">
          Filtra sobre los {{ alumnos.length }} alumnos. La paginación se reinicia automáticamente.
        </p>
      </div>

      <!-- Tabla -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
              <th class="px-5 py-3 text-left">ID</th>
              <th class="px-5 py-3 text-left">Nombre</th>
              <th class="px-5 py-3 text-left hidden sm:table-cell">Email</th>
              <th class="px-5 py-3 text-left hidden md:table-cell">Curso</th>
              <th class="px-5 py-3 text-center">Detalle</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="alumno in alumnosPagina"
              :key="alumno.id"
              class="border-t border-gray-100 hover:bg-brand-50 transition-colors"
            >
              <td class="px-5 py-3 text-gray-400 font-mono text-xs">{{ alumno.id }}</td>
              <td class="px-5 py-3 font-medium text-gray-800">{{ alumno.nombre }}</td>
              <td class="px-5 py-3 text-gray-500 hidden sm:table-cell">{{ alumno.email }}</td>
              <td class="px-5 py-3 hidden md:table-cell">
                <span class="bg-brand-100 text-brand-900 text-xs px-2 py-1 rounded-full">
                  {{ alumno.curso }}
                </span>
              </td>
              <td class="px-5 py-3 text-center">
                <RouterLink
                  :to="`/alumno/${alumno.id}`"
                  class="inline-block bg-brand-300 hover:bg-brand-400 text-brand-900 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  Ver
                </RouterLink>
              </td>
            </tr>

            <!-- Sin resultados -->
            <tr v-if="alumnosPagina.length === 0">
              <td colspan="5" class="px-5 py-10 text-center text-gray-400">
                No se encontró ningún alumno con ese nombre.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div v-if="totalPaginas > 1" class="flex items-center justify-between mt-5">
        <button
          @click="paginaAnterior"
          :disabled="paginaActual === 1"
          class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ← Anterior
        </button>

        <div class="flex items-center gap-1">
          <button
            v-for="p in paginasVisibles"
            :key="p"
            @click="irAPagina(p)"
            :class="[
              'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
              p === paginaActual
                ? 'bg-brand-300 text-brand-900 border border-brand-300'
                : 'border border-gray-300 text-gray-600 bg-white hover:bg-gray-50'
            ]"
          >
            {{ p }}
          </button>
        </div>

        <button
          @click="paginaSiguiente"
          :disabled="paginaActual === totalPaginas"
          class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente →
        </button>
      </div>

      <!-- Info paginación -->
      <p v-if="alumnosFiltrados.length > 0" class="text-center text-xs text-gray-400 mt-3">
        Mostrando {{ inicio + 1 }}–{{ Math.min(fin, alumnosFiltrados.length) }}
        de {{ alumnosFiltrados.length }}
      </p>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import alumnos from '../data/alumnos.json'

const POR_PAGINA = 10
const termino = ref('')
const paginaActual = ref(1)

// Filtrado sobre los 50 alumnos
const alumnosFiltrados = computed(() => {
  const t = termino.value.trim().toLowerCase()
  if (!t) return alumnos
  return alumnos.filter(a => a.nombre.toLowerCase().includes(t))
})

// Resetear paginación al buscar
watch(termino, () => { paginaActual.value = 1 })

const totalPaginas = computed(() =>
  Math.max(1, Math.ceil(alumnosFiltrados.value.length / POR_PAGINA))
)

const inicio = computed(() => (paginaActual.value - 1) * POR_PAGINA)
const fin = computed(() => inicio.value + POR_PAGINA)

const alumnosPagina = computed(() =>
  alumnosFiltrados.value.slice(inicio.value, fin.value)
)

// Mostrar máx. 5 páginas alrededor de la actual
const paginasVisibles = computed(() => {
  const total = totalPaginas.value
  const actual = paginaActual.value
  const rango = 2
  let desde = Math.max(1, actual - rango)
  let hasta = Math.min(total, actual + rango)
  if (hasta - desde < rango * 2) {
    if (desde === 1) hasta = Math.min(total, desde + rango * 2)
    else desde = Math.max(1, hasta - rango * 2)
  }
  const paginas = []
  for (let i = desde; i <= hasta; i++) paginas.push(i)
  return paginas
})

function irAPagina(p) { paginaActual.value = p }
function paginaAnterior() { if (paginaActual.value > 1) paginaActual.value-- }
function paginaSiguiente() { if (paginaActual.value < totalPaginas.value) paginaActual.value++ }
</script>
