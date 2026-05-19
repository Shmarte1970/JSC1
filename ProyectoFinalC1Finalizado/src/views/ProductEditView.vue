<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productsService } from '@/services/products.service'
import AppHeader from '@/components/AppHeader.vue'
import AppMessage from '@/components/AppMessage.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import type { Product, Unit } from '@/types'

const route  = useRoute()
const router = useRouter()

const product       = ref<Product | null>(null)
const units         = ref<Unit[]>([])
const loading       = ref(false)
const msg           = ref<{ type: 'success' | 'error'; text: string } | null>(null)
const showDeleteDlg = ref(false)

const form = ref({ name: '', unit: '', description: '' })

onMounted(async () => {
  loading.value = true
  const [prodResult, unitsResult] = await Promise.allSettled([
    productsService.getById(route.params.id as string),
    productsService.getUnits(),
  ])

  if (prodResult.status === 'fulfilled') {
    product.value = prodResult.value
    form.value = {
      name:        prodResult.value.name,
      unit:        prodResult.value.unit,
      description: prodResult.value.description ?? '',
    }
  } else {
    const err = (prodResult as PromiseRejectedResult).reason
    msg.value = {
      type: 'error',
      text: err?.response?.data?.message ?? `Error al cargar el producto (${err?.response?.status ?? 'sin conexión'}). ID recibido: ${route.params.id}`,
    }
  }

  if (unitsResult.status === 'fulfilled') {
    units.value = unitsResult.value
  }

  loading.value = false
})

async function save() {
  if (!form.value.name.trim()) { msg.value = { type: 'error', text: 'El nombre es obligatorio.' }; return }
  loading.value = true
  msg.value = null
  try {
    const updated = await productsService.update(product.value!.id, form.value)
    product.value = updated
    msg.value = { type: 'success', text: 'Producto actualizado.' }
  } catch (err: any) {
    msg.value = { type: 'error', text: err?.response?.data?.message ?? 'Error al guardar.' }
  } finally {
    loading.value = false
  }
}

async function remove() {
  showDeleteDlg.value = false
  loading.value = true
  try {
    await productsService.remove(product.value!.id)
    router.push({ name: 'products' })
  } catch (err: any) {
    msg.value = { type: 'error', text: err?.response?.data?.message ?? 'Error al eliminar.' }
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />

    <main class="flex-1 max-w-xl mx-auto w-full px-4 py-10 space-y-6">

      <div class="flex items-center gap-3">
        <button class="btn btn-secondary btn-sm" @click="router.push({ name: 'products' })">← Volver</button>
        <h1 class="text-xl">Editar producto</h1>
      </div>

      <AppMessage v-if="msg" :type="msg.type" :message="msg.text" @close="msg = null" />

      <div v-if="!product" class="text-center py-12 text-gray-400">Cargando…</div>

      <form v-else class="card space-y-4" @submit.prevent="save">
        <div>
          <label class="label">Nombre *</label>
          <input v-model="form.name" type="text" class="input" placeholder="Nombre del producto" />
        </div>
        <div>
          <label class="label">Unidad *</label>
          <select v-model="form.unit" class="input">
            <option value="" disabled>Selecciona unidad</option>
            <option v-for="u in units" :key="u.id" :value="u.id">{{ u.name }}</option>
          </select>
        </div>
        <div>
          <label class="label">Precio de referencia (€)</label>
          <input v-model="form.description" type="number" min="0" step="0.01" class="input" placeholder="0.00" />
        </div>

        <div class="flex gap-3 justify-between pt-2">
          <button type="button" class="btn btn-danger" @click="showDeleteDlg = true">
            🗑 Eliminar
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Guardando…' : 'Guardar cambios' }}
          </button>
        </div>
      </form>
    </main>

    <ConfirmDialog
      v-if="showDeleteDlg"
      title="Eliminar producto"
      :message="`¿Eliminar '${product?.name}'? Esta acción no se puede deshacer.`"
      confirm-label="Sí, eliminar"
      :danger="true"
      @confirm="remove"
      @cancel="showDeleteDlg = false"
    />
  </div>
</template>
