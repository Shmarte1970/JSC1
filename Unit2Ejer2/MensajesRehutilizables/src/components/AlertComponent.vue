<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { AlertProps } from '../models/alert-props.interface';

const props = withDefaults(defineProps<AlertProps>(), {
  type: 'info',
  duration: 3000,
});

const emit = defineEmits<{ close: [] }>();

const visible = ref(true);

onMounted(() => {
  setTimeout(() => {
    visible.value = false;
    emit('close');
  }, props.duration);
});
</script>

<template>
  <div v-if="visible" :class="['alert', `alert--${type}`]">
    <span class="alert__icon">
      <span v-if="type === 'success'">✔</span>
      <span v-else-if="type === 'warning'">⚠</span>
      <span v-else-if="type === 'error'">✖</span>
      <span v-else>ℹ</span>
    </span>
    <span class="alert__message">{{ message }}</span>
  </div>
</template>

<style scoped>
.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  border-radius: 8px;
  border-left: 4px solid;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
}

.alert--success {
  background-color: #ecfdf5;
  border-color: #22c55e;
  color: #15803d;
}

.alert--warning {
  background-color: #fffbeb;
  border-color: #f59e0b;
  color: #b45309;
}

.alert--error {
  background-color: #fef2f2;
  border-color: #ef4444;
  color: #b91c1c;
}

.alert--info {
  background-color: #eff6ff;
  border-color: #3b82f6;
  color: #1d4ed8;
}

.alert__icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}
</style>
