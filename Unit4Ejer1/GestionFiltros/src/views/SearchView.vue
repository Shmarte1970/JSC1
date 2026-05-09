<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-brand-200 shadow-md">
      <div class="max-w-5xl mx-auto px-6 py-5">
        <h1 class="text-2xl font-bold text-brand-900 tracking-tight">
          Búsqueda de Productos
        </h1>
        <p class="text-brand-400 text-sm mt-1">
          Catálogo de herramientas — {{ totalProductos }} referencias disponibles
        </p>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-16">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-10 max-w-xl mx-auto">
        <h2 class="text-lg font-semibold text-gray-700 mb-6">
          ¿Qué herramienta buscas?
        </h2>

        <form @submit.prevent="buscar">
          <div class="relative mb-4">
            <span class="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none text-lg">
              🔍
            </span>
            <input
              v-model="termino"
              type="text"
              placeholder="Ej: llave Allen, martillo, broca..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent transition"
              autofocus
            />
          </div>

          <button
            type="submit"
            :disabled="!termino.trim()"
            class="w-full bg-brand-300 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-brand-900 font-semibold py-3 rounded-xl transition-colors"
          >
            Buscar
          </button>
        </form>

        <p v-if="sinResultados" class="mt-4 text-sm text-red-400 text-center">
          No se encontraron productos para <strong>«{{ ultimaBusqueda }}»</strong>.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import productos from '../data/productos.json'

const router = useRouter()
const route  = useRoute()

const termino        = ref('')
const sinResultados  = ref(false)
const ultimaBusqueda = ref('')
const totalProductos = productos.length

// Recuperar el término al volver desde resultados
onMounted(() => {
  if (route.query.term) {
    termino.value = route.query.term
  }
})

function buscar() {
  const t = termino.value.trim()
  if (!t) return

  // Comprobar si hay resultados antes de navegar
  const hay = productos.some(p => p.nombre.toLowerCase().includes(t.toLowerCase()))
  if (!hay) {
    ultimaBusqueda.value = t
    sinResultados.value  = true
    return
  }

  sinResultados.value = false
  // Navegación programática con router.push — query param en la URL
  router.push({ path: '/search/results', query: { term: t } })
}
</script>
