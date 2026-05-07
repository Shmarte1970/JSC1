<script setup lang="ts">
import { ref } from 'vue';
import AlertComponent from './components/AlertComponent.vue';
import type { AlertProps } from './models/alert-props.interface';

const alertVisible = ref(false);
const alertProps = ref<AlertProps>({ message: '' });

function showAlert(type: AlertProps['type']) {
  const messages: Record<NonNullable<AlertProps['type']>, string> = {
    success: 'Operación realizada correctamente.',
    warning: 'Mensaje de advertencia.',
    error: 'Se ha producido un error.',
    info: 'Mensaje informativo.',
  };
  alertProps.value = { type, message: messages[type!] };
  alertVisible.value = true;
}
</script>

<template>
  <main>
    <h1>Mensajes Reutilizables</h1>

    <div class="buttons">
      <button class="btn btn--success" @click="showAlert('success')">Correcto</button>
      <button class="btn btn--warning" @click="showAlert('warning')">Aviso</button>
      <button class="btn btn--error" @click="showAlert('error')">Error</button>
    </div>

    <AlertComponent
      v-if="alertVisible"
      :type="alertProps.type"
      :message="alertProps.message"
      @close="alertVisible = false"
    />
  </main>
</template>

<style scoped>
main {
  max-width: 600px;
  margin: 3rem auto;
  padding: 0 1rem;
  font-family: sans-serif;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #1e293b;
}

.buttons {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.btn {
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.85;
}

.btn--success {
  background-color: #22c55e;
  color: #fff;
}

.btn--warning {
  background-color: #f59e0b;
  color: #fff;
}

.btn--error {
  background-color: #ef4444;
  color: #fff;
}
</style>
