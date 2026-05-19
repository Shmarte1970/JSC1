<script setup lang="ts">
defineProps<{
  type?: 'success' | 'error' | 'info' | 'warning'
  message: string
}>()

const emit = defineEmits<{ close: [] }>()

const icons = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
}

const styles = {
  success: 'bg-sage-50   border-sage-200   text-sage-700',
  error:   'bg-red-50    border-red-200    text-red-700',
  info:    'bg-lavender-50 border-lavender-200 text-lavender-700',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
}
</script>

<template>
  <div
    v-if="message"
    :class="['flex items-start gap-3 px-4 py-3 rounded-xl border text-sm font-medium', styles[type ?? 'info']]"
    role="alert"
  >
    <span class="text-base leading-none mt-0.5">{{ icons[type ?? 'info'] }}</span>
    <span class="flex-1">{{ message }}</span>
    <button
      type="button"
      class="ml-auto opacity-60 hover:opacity-100 leading-none"
      aria-label="Cerrar mensaje"
      @click="emit('close')"
    >
      ✕
    </button>
  </div>
</template>
