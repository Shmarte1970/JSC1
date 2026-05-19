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

function norm(s: string) {
  return s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

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
      'flex items-center gap-4 p-3 rounded-xl border border-gray-100 bg-white transition-all duration-150',
      selectable ? 'cursor-pointer hover:border-sage-200 hover:bg-sage-50' : 'hover:bg-gray-50',
      selected   ? 'border-sage-300 bg-sage-50' : '',
    ]"
    @click="selectable && emit('select', product)"
  >
    <!-- Imagen pequeña -->
    <div class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-gray-50 p-1">
      <img :src="imageSrc" :alt="product.name" class="w-full h-full object-contain" loading="lazy" />
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-800 truncate">{{ product.name }}</p>
      <p class="text-xs text-gray-400">{{ product.unit }}</p>
    </div>

    <!-- Botones o check -->
    <div class="flex-shrink-0 flex gap-1">
      <div v-if="selectable && selected" class="w-5 h-5 rounded-full bg-sage-300 flex items-center justify-center">
        <span class="text-white text-xs">✓</span>
      </div>
      <template v-else-if="!selectable">
        <button class="btn btn-secondary btn-sm" @click.stop="emit('edit', product)">✏️ Editar</button>
        <button class="btn btn-danger btn-sm" aria-label="Eliminar producto" @click.stop="emit('delete', product)">🗑</button>
      </template>
    </div>
  </div>
</template>
