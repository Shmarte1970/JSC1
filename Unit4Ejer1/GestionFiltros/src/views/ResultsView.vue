<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Cabecera -->
    <header class="bg-brand-200 shadow-md">
      <div class="max-w-5xl mx-auto px-6 py-5 flex items-center gap-4">
        <button
          @click="volver"
          class="flex items-center gap-2 text-brand-400 hover:text-brand-900 text-sm font-medium transition-colors"
        >
          ← Volver a la búsqueda
        </button>
        <span class="text-brand-300">|</span>
        <h1 class="text-xl font-bold text-brand-900">Resultados de búsqueda</h1>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-8">

      <!-- Info de búsqueda -->
      <div class="mb-5 flex items-center justify-between">
        <div>
          <span class="text-sm text-gray-500">Resultados para: </span>
          <span class="text-sm font-semibold text-brand-900">«{{ termino }}»</span>
        </div>
        <span class="text-sm text-brand-400">
          {{ resultados.length }} producto{{ resultados.length !== 1 ? 's' : '' }} encontrado{{ resultados.length !== 1 ? 's' : '' }}
        </span>
      </div>

      <!-- Tabla de resultados -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
              <th class="px-5 py-3 text-left">ID</th>
              <th class="px-5 py-3 text-left">Nombre</th>
              <th class="px-5 py-3 text-left hidden sm:table-cell">Categoría</th>
              <th class="px-5 py-3 text-right">Precio</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="producto in resultadosPagina"
              :key="producto.id"
              class="border-t border-gray-100 hover:bg-brand-50 transition-colors"
            >
              <td class="px-5 py-3 text-gray-400 font-mono text-xs">{{ producto.id }}</td>
              <td class="px-5 py-3 font-medium text-gray-800">{{ producto.nombre }}</td>
              <td class="px-5 py-3 hidden sm:table-cell">
                <span class="bg-brand-100 text-brand-900 text-xs px-2 py-1 rounded-full">
                  {{ producto.categoria }}
                </span>
              </td>
              <td class="px-5 py-3 text-right font-semibold text-gray-700">
                {{ producto.precio.toFixed(2) }} €
              </td>
            </tr>

            <tr v-if="resultados.length === 0">
              <td colspan="4" class="px-5 py-10 text-center text-gray-400">
                No se encontraron productos para «{{ termino }}».
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

      <p v-if="resultados.length > 0" class="text-center text-xs text-gray-400 mt-3">
        Mostrando {{ inicio + 1 }}–{{ Math.min(fin, resultados.length) }} de {{ resultados.length }}
      </p>

      <!-- Botón volver -->
      <div class="mt-8 flex justify-center">
        <button
          @click="volver"
          class="bg-brand-300 hover:bg-brand-400 text-brand-900 font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          ← Volver a la búsqueda
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import productos from '../data/productos.json'

const route  = useRoute()
const router = useRouter()

// Query param leído directamente con useRoute() — sin props: true
const termino = computed(() => route.query.term || '')

const POR_PAGINA  = 10
const paginaActual = ref(1)

const resultados = computed(() => {
  const t = termino.value.trim().toLowerCase()
  if (!t) return []
  return productos.filter(p => p.nombre.toLowerCase().includes(t))
})

const totalPaginas = computed(() =>
  Math.max(1, Math.ceil(resultados.value.length / POR_PAGINA))
)

const inicio = computed(() => (paginaActual.value - 1) * POR_PAGINA)
const fin    = computed(() => inicio.value + POR_PAGINA)

const resultadosPagina = computed(() =>
  resultados.value.slice(inicio.value, fin.value)
)

const paginasVisibles = computed(() => {
  const total  = totalPaginas.value
  const actual = paginaActual.value
  const rango  = 2
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

function irAPagina(p)    { paginaActual.value = p }
function paginaAnterior() { if (paginaActual.value > 1) paginaActual.value-- }
function paginaSiguiente() { if (paginaActual.value < totalPaginas.value) paginaActual.value++ }

// Volver recuperando el término en la URL de búsqueda
function volver() {
  router.push({ path: '/search', query: { term: termino.value } })
}
</script>
