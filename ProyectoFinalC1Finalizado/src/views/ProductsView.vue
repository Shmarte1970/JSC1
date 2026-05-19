<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { productsService } from '@/services/products.service'
import AppHeader from '@/components/AppHeader.vue'
import AppMessage from '@/components/AppMessage.vue'
import ProductCard from '@/components/ProductCard.vue'
import ProductListItem from '@/components/ProductListItem.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import type { Product, Unit, CreateProductPayload } from '@/types'
import productosData from '@/data/productos.json'

const router = useRouter()

// Estado
const products        = ref<Product[]>([])
const units           = ref<Unit[]>([])
const search          = ref('')
const viewMode        = ref<'cards' | 'list'>('cards')
const loading         = ref(false)
const msg             = ref<{ type: 'success' | 'error'; text: string } | null>(null)
const showForm        = ref(false)
const productToDelete = ref<Product | null>(null)

// Formulario nuevo producto
const newProduct = ref<CreateProductPayload>({ name: '', unit: '', description: '' })
const formError  = ref('')

// Modal de sugerencias (/list)
const showSuggestions   = ref(false)
const suggSearch        = ref('')
const categories        = [...new Set(productosData.map((p) => p.categoria))]
const filteredSugg      = computed(() => {
  const q = suggSearch.value.toLowerCase()
  return productosData.filter((p) => p.nombre.toLowerCase().includes(q))
})

watch(search, (val) => {
  if (val.trim() === '/list') {
    search.value       = ''
    suggSearch.value   = ''
    showSuggestions.value = true
  }
})

const filtered = computed(() =>
  products.value.filter((p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase()),
  ),
)

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  const [prodsResult, unitsResult] = await Promise.allSettled([
    productsService.getAll(),
    productsService.getUnits(),
  ])

  if (prodsResult.status === 'fulfilled') {
    products.value = prodsResult.value
  } else {
    const err = (prodsResult as PromiseRejectedResult).reason
    // 404 = sin productos aún → catálogo vacío (no es un error real)
    if (err?.response?.status !== 404) {
      msg.value = { type: 'error', text: 'Error al cargar los productos.' }
    }
    products.value = []
  }

  if (unitsResult.status === 'fulfilled') {
    units.value = unitsResult.value
  }

  loading.value = false
}

async function createProduct() {
  formError.value = ''
  if (!newProduct.value.name.trim()) { formError.value = 'El nombre es obligatorio.'; return }
  if (!newProduct.value.unit)         { formError.value = 'Selecciona una unidad.';   return }

  loading.value = true
  try {
    const created = await productsService.create(newProduct.value)
    products.value.unshift(created)
    newProduct.value = { name: '', unit: '', description: '' }
    showForm.value = false
    msg.value = { type: 'success', text: `Producto "${created.name}" creado.` }
  } catch (err: any) {
    msg.value = { type: 'error', text: err?.response?.data?.message ?? 'Error al crear el producto.' }
  } finally {
    loading.value = false
  }
}

function goEdit(product: Product) {
  router.push({ name: 'product-edit', params: { id: product.id } })
}

async function removeProduct() {
  if (!productToDelete.value) return
  const id = productToDelete.value.id
  productToDelete.value = null
  loading.value = true
  try {
    await productsService.remove(id)
    products.value = products.value.filter((p) => p.id !== id)
    msg.value = { type: 'success', text: 'Producto eliminado.' }
  } catch (err: any) {
    const status = err?.response?.status
    const text = status === 500 || status === 409
      ? 'No se puede eliminar: el producto está incluido en una o más listas. Quítalo de esas listas primero.'
      : (err?.response?.data?.message ?? 'Error al eliminar.')
    msg.value = { type: 'error', text }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />

    <main class="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-6">

      <!-- Cabecera -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1>Catálogo de productos</h1>
          <p class="text-sm text-gray-400 mt-1">
            {{ products.length }} productos · {{ units.length }} unidades disponibles
          </p>
        </div>
        <button class="btn btn-primary" @click="showForm = !showForm">
          {{ showForm ? '✕ Cancelar' : '+ Nuevo producto' }}
        </button>
      </div>

      <AppMessage v-if="msg" :type="msg.type" :message="msg.text" @close="msg = null" />

      <!-- Formulario nuevo producto -->
      <div v-if="showForm" class="card space-y-4">
        <h2 class="text-base font-semibold text-gray-700">Nuevo producto</h2>
        <p v-if="formError" class="error-msg">{{ formError }}</p>
        <div class="grid sm:grid-cols-3 gap-4">
          <div>
            <label class="label">Nombre *</label>
            <input v-model="newProduct.name" type="text" class="input" placeholder="Ej: Manzana" @keyup.enter="createProduct" />
          </div>
          <div>
            <label class="label">Unidad *</label>
            <select v-model="newProduct.unit" class="input">
              <option value="" disabled>Selecciona unidad</option>
              <option v-for="u in units" :key="u.id" :value="u.id">{{ u.name }}</option>
            </select>
          </div>
          <div>
            <label class="label">Precio de referencia (€)</label>
            <input v-model="newProduct.description" type="number" min="0" step="0.01" class="input" placeholder="0.00" />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button class="btn btn-secondary" @click="showForm = false; formError = ''">Cancelar</button>
          <button class="btn btn-primary" :disabled="loading" @click="createProduct">
            {{ loading ? 'Guardando…' : 'Crear producto' }}
          </button>
        </div>
      </div>

      <!-- Buscador y toggle vista -->
      <div class="flex flex-col sm:flex-row gap-3">
        <input v-model="search" type="search" class="input flex-1" placeholder="Buscar por nombre… (escribe /list para ver ejemplos)" />
        <div class="flex gap-2">
          <button :class="['btn btn-sm', viewMode === 'cards' ? 'btn-primary' : 'btn-secondary']" @click="viewMode = 'cards'">
            ⊞ Tarjetas
          </button>
          <button :class="['btn btn-sm', viewMode === 'list' ? 'btn-primary' : 'btn-secondary']" @click="viewMode = 'list'">
            ☰ Lista
          </button>
          <button class="btn btn-secondary btn-sm" :disabled="loading" @click="loadData">
            ↺ Recargar
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12 text-gray-400">Cargando productos…</div>

      <!-- Sin resultados -->
      <div v-else-if="filtered.length === 0" class="text-center py-12 text-gray-400">
        <div class="text-5xl mb-3">🛒</div>
        <p>No se encontraron productos{{ search ? ` para "${search}"` : '' }}.</p>
        <p v-if="!search" class="text-sm mt-2">
          ¿No sabes qué añadir?
          <button class="text-pink-500 underline hover:text-pink-700" @click="showSuggestions = true">
            Ver ejemplos de productos
          </button>
        </p>
      </div>

      <!-- Vista tarjetas -->
      <div v-else-if="viewMode === 'cards'" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <ProductCard
          v-for="p in filtered"
          :key="p.id"
          :product="p"
          @edit="goEdit"
          @delete="productToDelete = $event"
        />
      </div>

      <!-- Vista lista -->
      <div v-else class="space-y-2">
        <ProductListItem
          v-for="p in filtered"
          :key="p.id"
          :product="p"
          @edit="goEdit"
          @delete="productToDelete = $event"
        />
      </div>
    </main>

    <!-- Modal sugerencias de productos (/list) -->
    <Teleport to="body">
      <div
        v-if="showSuggestions"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        @click.self="showSuggestions = false"
      >
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
          <!-- Cabecera modal -->
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
            <div>
              <h2 class="font-semibold text-gray-800">Ejemplos de productos</h2>
              <p class="text-xs text-gray-400 mt-0.5">Referencia de nombres e imágenes disponibles</p>
            </div>
            <button class="text-gray-400 hover:text-gray-600 text-xl leading-none" @click="showSuggestions = false">✕</button>
          </div>
          <!-- Buscador interno -->
          <div class="px-5 py-3 border-b border-gray-100">
            <input
              v-model="suggSearch"
              type="search"
              class="input"
              placeholder="Filtrar productos…"
              autofocus
            />
          </div>
          <!-- Lista de productos agrupados -->
          <div class="overflow-y-auto px-5 py-4 space-y-5">
            <div v-for="cat in categories" :key="cat">
              <template v-if="filteredSugg.some((p) => p.categoria === cat)">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{{ cat }}</p>
                <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  <div
                    v-for="p in filteredSugg.filter((p) => p.categoria === cat)"
                    :key="p.nombre"
                    class="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-50 cursor-default"
                    :title="p.nombre"
                  >
                    <img :src="p.imagen" :alt="p.nombre" class="w-12 h-12 object-contain" />
                    <span class="text-xs text-gray-600 text-center leading-tight">{{ p.nombre }}</span>
                  </div>
                </div>
              </template>
            </div>
            <p v-if="filteredSugg.length === 0" class="text-center text-gray-400 py-6">Sin coincidencias.</p>
          </div>
        </div>
      </div>
    </Teleport>

    <ConfirmDialog
      v-if="productToDelete"
      title="Eliminar producto"
      :message="`¿Eliminar '${productToDelete.name}'? Esta acción no se puede deshacer.`"
      confirm-label="Sí, eliminar"
      :danger="true"
      @confirm="removeProduct"
      @cancel="productToDelete = null"
    />
  </div>
</template>
