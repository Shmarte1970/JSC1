<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import productosData from '@/data/productos.json'

const props = defineProps<{
  product: Product
  selectable?: boolean
  selected?: boolean
}>()

const emit = defineEmits<{
  select: [product: Product]
  edit:   [product: Product]
  delete: [product: Product]
}>()

// Normaliza: minúsculas + sin tildes
function norm(s: string) {
  return s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

// Busca imagen por nombre exacto, plural (+s, +es) o sin tilde
const imageSrc = computed(() => {
  const name = norm(props.product.name)
  const match = productosData.find((p) => {
    const ref = norm(p.nombre)
    return (
      ref === name ||
      name === ref + 's'  ||
      name === ref + 'es' ||
      ref  === name + 's' ||
      ref  === name + 'es'
    )
  })
  return match?.imagen ?? '/img/placeholder.svg'
})
</script>

<template>
  <div
    :class="[
      'relative card flex flex-col items-center gap-3 transition-all duration-150',
      selectable ? 'cursor-pointer hover:shadow-medium' : '',
      selected   ? 'ring-2 ring-sage-300 bg-sage-50' : '',
    ]"
    @click="selectable && emit('select', product)"
  >
    <!-- Imagen SVG -->
    <div class="w-20 h-20 flex items-center justify-center rounded-xl bg-gray-50 p-2">
      <img :src="imageSrc" :alt="product.name" class="w-full h-full object-contain" loading="lazy" />
    </div>

    <!-- Nombre y unidad -->
    <div class="text-center w-full">
      <p class="text-sm font-semibold text-gray-800 truncate">{{ product.name }}</p>
      <p class="text-xs text-gray-400 mt-0.5">{{ product.unit }}</p>
    </div>

    <!-- Botones editar / eliminar (si no es seleccionable) -->
    <div v-if="!selectable" class="flex gap-2 w-full mt-1">
      <button
        class="btn btn-secondary btn-sm flex-1"
        @click.stop="emit('edit', product)"
      >
        ✏️ Editar
      </button>
      <button
        class="btn btn-danger btn-sm"
        aria-label="Eliminar producto"
        @click.stop="emit('delete', product)"
      >
        🗑
      </button>
    </div>

    <!-- Check seleccionado -->
    <div v-if="selectable && selected" class="absolute top-2 right-2 w-5 h-5 rounded-full bg-sage-300 flex items-center justify-center">
      <span class="text-white text-xs">✓</span>
    </div>
  </div>
</template>
