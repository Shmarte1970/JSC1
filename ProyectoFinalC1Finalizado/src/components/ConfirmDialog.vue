<script setup lang="ts">
defineProps<{
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel:  []
}>()
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" @click.self="emit('cancel')">
      <div class="bg-white rounded-2xl shadow-strong w-full max-w-sm mx-4 p-6 animate-fade-in">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ title }}</h3>
        <p class="text-sm text-gray-500 mb-6">{{ message }}</p>
        <div class="flex justify-end gap-3">
          <button class="btn btn-secondary" @click="emit('cancel')">
            {{ cancelLabel ?? 'Cancelar' }}
          </button>
          <button :class="danger ? 'btn btn-danger' : 'btn btn-primary'" @click="emit('confirm')">
            {{ confirmLabel ?? 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
