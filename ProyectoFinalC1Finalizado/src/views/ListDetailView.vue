<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { listsService } from '@/services/lists.service'
import { productsService } from '@/services/products.service'
import AppHeader from '@/components/AppHeader.vue'
import AppMessage from '@/components/AppMessage.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import ProductCard from '@/components/ProductCard.vue'
import type { ShoppingList, Product, ListItem } from '@/types'
import productosData from '@/data/productos.json'

function norm(s: string) {
  return s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
function itemImage(name: string): string {
  const n = norm(name)
  const m = productosData.find((p) => {
    const r = norm(p.nombre)
    return r === n || n === r + 's' || n === r + 'es' || r === n + 's' || r === n + 'es'
  })
  return m?.imagen ?? '/img/placeholder.svg'
}

const route  = useRoute()
const router = useRouter()

const list      = ref<ShoppingList | null>(null)
const products  = ref<Product[]>([])
const loading   = ref(false)
const msg       = ref<{ type: 'success' | 'error'; text: string } | null>(null)
const showAddPanel  = ref(false)
const itemToDelete  = ref<ListItem | null>(null)
const productSearch = ref('')

// Precios recordados por productId (localStorage)
const PRICE_KEY = 'lastPrices'
function loadPriceCache(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(PRICE_KEY) ?? '{}') } catch { return {} }
}
function savePrice(productId: string, price: number) {
  const cache = loadPriceCache()
  cache[productId] = price
  localStorage.setItem(PRICE_KEY, JSON.stringify(cache))
}
function recalledPrice(productId: string): number {
  return loadPriceCache()[productId] ?? 0
}

// Formulario añadir ítem
const addForm = ref({ productId: '', quantity: 1, price: 0 })
const selectedProduct = ref<Product | null>(null)

// Edición inline de ítem
const itemToEdit   = ref<ListItem | null>(null)
const editItemForm = ref({ quantity: 1, price: 0 })

const filteredProducts = computed(() =>
  products.value.filter((p) =>
    p.name.toLowerCase().includes(productSearch.value.toLowerCase()),
  ),
)

const totalPrice = computed(() =>
  list.value?.items?.reduce((sum, i) => sum + i.quantity * i.price, 0) ?? 0,
)

const addSubtotal = computed(() =>
  addForm.value.quantity > 0 && addForm.value.price >= 0
    ? addForm.value.quantity * addForm.value.price
    : 0,
)

const totalItems = computed(() => list.value?.items?.length ?? 0)

onMounted(async () => {
  loading.value = true
  if (route.query.add === '1') showAddPanel.value = true

  const [listResult, prodsResult] = await Promise.allSettled([
    listsService.getById(route.params.id as string),
    productsService.getAll(),
  ])

  if (listResult.status === 'fulfilled') {
    list.value = listResult.value
  } else {
    const err = (listResult as PromiseRejectedResult).reason
    msg.value = {
      type: 'error',
      text: err?.response?.data?.message ?? `Error al cargar la lista (${err?.response?.status ?? 'sin conexión'}).`,
    }
  }

  if (prodsResult.status === 'fulfilled') {
    products.value = prodsResult.value
  }

  loading.value = false
})

function selectProduct(p: Product) {
  selectedProduct.value = p
  addForm.value.productId = p.id
  // Precio de referencia: primero desde descripción del producto, luego desde caché local
  const descPrice = p.description ? parseFloat(p.description.replace(',', '.')) : NaN
  addForm.value.price = (!isNaN(descPrice) && descPrice >= 0)
    ? descPrice
    : recalledPrice(p.id)
}

async function addItem() {
  if (!addForm.value.productId)       { msg.value = { type: 'error', text: 'Selecciona un producto.' }; return }
  if (addForm.value.quantity < 1)     { msg.value = { type: 'error', text: 'La cantidad debe ser ≥ 1.' }; return }
  if (addForm.value.price < 0)        { msg.value = { type: 'error', text: 'El precio no puede ser negativo.' }; return }

  loading.value = true
  try {
    const newItem = await listsService.addItem(list.value!.id, {
      productId: addForm.value.productId,
      quantity:  addForm.value.quantity,
      price:     addForm.value.price,
    })
    savePrice(addForm.value.productId, addForm.value.price)
    list.value!.items.push(newItem)
    addForm.value = { productId: '', quantity: 1, price: 0 }
    selectedProduct.value = null
    showAddPanel.value = false
    msg.value = { type: 'success', text: 'Producto añadido a la lista.' }
  } catch (err: any) {
    msg.value = { type: 'error', text: err?.response?.data?.message ?? 'Error al añadir el producto.' }
  } finally {
    loading.value = false
  }
}

function openEditItem(item: ListItem) {
  itemToEdit.value   = item
  editItemForm.value = { quantity: item.quantity, price: item.price }
}

async function saveItem() {
  if (!itemToEdit.value) return
  if (editItemForm.value.quantity < 1) { msg.value = { type: 'error', text: 'La cantidad debe ser ≥ 1.' }; return }
  if (editItemForm.value.price < 0)    { msg.value = { type: 'error', text: 'El precio no puede ser negativo.' }; return }

  const itemId = itemToEdit.value.id
  loading.value = true
  try {
    const updated = await listsService.updateItem(list.value!.id, itemId, {
      quantity: editItemForm.value.quantity,
      price:    editItemForm.value.price,
    })
    const idx = list.value!.items.findIndex((i) => i.id === itemId)
    if (idx !== -1) list.value!.items[idx] = { ...list.value!.items[idx], ...updated }
    itemToEdit.value = null
    msg.value = { type: 'success', text: 'Ítem actualizado.' }
  } catch (err: any) {
    msg.value = { type: 'error', text: err?.response?.data?.message ?? 'Error al actualizar.' }
  } finally {
    loading.value = false
  }
}

async function removeItem() {
  if (!itemToDelete.value) return
  const itemId = itemToDelete.value.id
  itemToDelete.value = null
  loading.value = true
  try {
    await listsService.removeItem(list.value!.id, itemId)
    list.value!.items = list.value!.items.filter((i) => i.id !== itemId)
    msg.value = { type: 'success', text: 'Producto eliminado de la lista.' }
  } catch (err: any) {
    msg.value = { type: 'error', text: err?.response?.data?.message ?? 'Error al eliminar.' }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />

    <main class="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-6">

      <!-- Cabecera -->
      <div class="flex items-center gap-3 flex-wrap">
        <button class="btn btn-secondary btn-sm" @click="router.push({ name: 'lists' })">← Volver</button>
        <h1 class="flex-1 min-w-0 truncate">{{ list?.title ?? 'Cargando…' }}</h1>
        <button class="btn btn-primary" @click="showAddPanel = !showAddPanel">
          {{ showAddPanel ? '✕ Cancelar' : '+ Añadir producto' }}
        </button>
      </div>

      <!-- Resumen -->
      <div class="flex gap-4 text-sm text-gray-600 flex-wrap" v-if="list">
        <span class="badge badge-gray">📦 {{ totalItems }} productos</span>
        <span class="badge badge-sage font-semibold">💰 Total: {{ totalPrice.toFixed(2) }} €</span>
      </div>

      <AppMessage v-if="msg" :type="msg.type" :message="msg.text" @close="msg = null" />

      <!-- Panel añadir producto -->
      <div v-if="showAddPanel" class="card space-y-4">
        <h2 class="text-base font-semibold text-gray-700">Añadir producto a la lista</h2>

        <!-- Buscador de productos -->
        <input v-model="productSearch" type="search" class="input" placeholder="Buscar producto…" />

        <!-- Grid seleccionable -->
        <div v-if="filteredProducts.length === 0" class="text-sm text-gray-400 text-center py-4">
          No hay productos. <router-link :to="{ name: 'products' }" class="text-sage-500 hover:underline">Crea productos primero.</router-link>
        </div>
        <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-64 overflow-y-auto">
          <ProductCard
            v-for="p in filteredProducts"
            :key="p.id"
            :product="p"
            :selectable="true"
            :selected="selectedProduct?.id === p.id"
            @select="selectProduct"
          />
        </div>

        <!-- Cantidad y precio -->
        <div v-if="selectedProduct" class="grid sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
          <div>
            <label class="label">Producto seleccionado</label>
            <p class="text-sm font-semibold text-sage-600">{{ selectedProduct.name }}</p>
          </div>
          <div>
            <label class="label">Cantidad *</label>
            <input v-model.number="addForm.quantity" type="number" min="1" class="input" />
          </div>
          <div>
            <label class="label">Precio (€) *</label>
            <input v-model.number="addForm.price" type="number" min="0" step="0.01" class="input" placeholder="0.00" />
          </div>
        </div>

        <!-- Subtotal en tiempo real -->
        <div v-if="selectedProduct" class="flex items-center justify-between px-1">
          <span class="text-sm text-gray-500">
            {{ addForm.quantity }} × {{ addForm.price.toFixed(2) }} € =
          </span>
          <span class="text-lg font-bold text-sage-600">{{ addSubtotal.toFixed(2) }} €</span>
        </div>

        <div class="flex justify-end">
          <button class="btn btn-primary" :disabled="loading || !selectedProduct" @click="addItem">
            {{ loading ? 'Añadiendo…' : 'Añadir a la lista' }}
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading && !list" class="text-center py-12 text-gray-400">Cargando lista…</div>

      <!-- Lista vacía -->
      <div v-else-if="list && list.items?.length === 0" class="text-center py-12 text-gray-400">
        <div class="text-5xl mb-3">🛒</div>
        <p class="font-medium">La lista está vacía</p>
        <p class="text-sm mt-1">Añade productos usando el botón de arriba.</p>
      </div>

      <!-- Ítems de la lista -->
      <div v-else-if="list?.items?.length" class="space-y-2">
        <div
          v-for="item in list.items"
          :key="item.id"
        >
          <!-- Modo edición inline del ítem -->
          <div v-if="itemToEdit !== null && itemToEdit.id === item.id" class="card ring-2 ring-sage-300">
            <div class="flex items-center gap-3">
              <!-- SVG -->
              <img :src="itemImage(item.product.name)" :alt="item.product.name" class="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1 flex-shrink-0" />
              <!-- Nombre -->
              <p class="text-sm font-bold text-gray-700 flex-1 truncate">{{ item.product.name }}</p>
              <!-- Cantidad -->
              <div class="flex flex-col items-center gap-0.5 flex-shrink-0">
                <label class="text-xs text-gray-400">Cant.</label>
                <input
                  v-model.number="editItemForm.quantity"
                  type="number"
                  min="1"
                  class="input w-20 text-center"
                />
              </div>
              <!-- Precio -->
              <div class="flex flex-col items-center gap-0.5 flex-shrink-0">
                <label class="text-xs text-gray-400">Precio €</label>
                <input
                  v-model.number="editItemForm.price"
                  type="number"
                  min="0"
                  step="0.01"
                  class="input w-24 text-center"
                />
              </div>
              <!-- Acciones -->
              <div class="flex gap-1 flex-shrink-0">
                <button class="btn btn-secondary btn-sm" @click="itemToEdit = null">✕</button>
                <button class="btn btn-primary btn-sm" :disabled="loading" @click="saveItem">Guardar</button>
              </div>
            </div>
          </div>

          <!-- Fila normal del ítem -->
          <div v-else class="card flex items-center gap-3 py-3">
            <!-- SVG del producto -->
            <img
              :src="itemImage(item.product.name)"
              :alt="item.product.name"
              class="w-12 h-12 object-contain flex-shrink-0 rounded-lg bg-gray-50 p-1"
            />

            <!-- Nombre del producto -->
            <div class="flex-1 min-w-0">
              <p class="text-base font-bold text-gray-800 truncate">{{ item.product.name }}</p>
              <p class="text-xs text-gray-400 uppercase tracking-wide">{{ item.product.unit }}</p>
            </div>

            <!-- Cantidad (máx. 5 dígitos → ~60px) -->
            <div class="text-center flex-shrink-0 w-14">
              <p class="text-xl font-bold text-gray-700 tabular-nums">{{ item.quantity }}</p>
              <p class="text-xs text-gray-400">cant.</p>
            </div>

            <!-- Precio unitario (máx. 6 dígitos → ~76px) -->
            <div class="text-center flex-shrink-0 w-20">
              <p class="text-sm font-semibold text-gray-600 tabular-nums">{{ item.price.toFixed(2) }}€</p>
              <p class="text-xs text-gray-400">c/u</p>
            </div>

            <!-- Total ítem -->
            <div class="text-right flex-shrink-0 w-20">
              <p class="text-base font-bold text-sage-600 tabular-nums">{{ (item.quantity * item.price).toFixed(2) }}€</p>
              <p class="text-xs text-gray-400">total</p>
            </div>

            <!-- Acciones -->
            <div class="flex gap-1 flex-shrink-0">
              <button class="btn btn-secondary btn-sm" @click="openEditItem(item)" aria-label="Editar ítem">✏️</button>
              <button class="btn btn-danger btn-sm" @click="itemToDelete = item" aria-label="Eliminar ítem">🗑</button>
            </div>
          </div>
        </div>

        <!-- Total final -->
        <div class="card border-sage-200 bg-sage-50 flex justify-between items-center">
          <span class="font-semibold text-gray-700">Total de la lista</span>
          <span class="text-xl font-bold text-sage-600">{{ totalPrice.toFixed(2) }} €</span>
        </div>
      </div>
    </main>

    <ConfirmDialog
      v-if="itemToDelete"
      title="Eliminar producto"
      :message="`¿Quitar '${itemToDelete.product.name}' de la lista?`"
      confirm-label="Sí, quitar"
      :danger="true"
      @confirm="removeItem"
      @cancel="itemToDelete = null"
    />
  </div>
</template>
