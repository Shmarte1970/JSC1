<script setup lang="ts">
import { useFormValidation } from '../composables/useFormValidation';
import type { User } from '../models/user.interface';

const props = defineProps<{ registered: boolean }>();
const emit = defineEmits<{ register: [user: User] }>();

const { name, email, password, nameError, emailError, passwordError, passwordStrength, errors, isValid, reset } = useFormValidation();

function handleSubmit() {
  if (!isValid.value) return;
  emit('register', { name: name.value, email: email.value, password: password.value });
}

defineExpose({ reset });
</script>

<template>
  <form class="form" @submit.prevent="handleSubmit" novalidate>
    <div class="field">
      <label for="name">Nombre</label>
      <input id="name" v-model="name" type="text" placeholder="Tu nombre" :disabled="registered" />
      <span v-if="nameError" class="field__error">{{ nameError }}</span>
    </div>

    <div class="field">
      <label for="email">Correo electrónico</label>
      <input id="email" v-model="email" type="email" placeholder="correo@ejemplo.com" :disabled="registered" />
      <span v-if="emailError" class="field__error">{{ emailError }}</span>
    </div>

    <div class="field">
      <label for="password">Contraseña</label>
      <input id="password" v-model="password" type="password" placeholder="Mínimo 8 caracteres" :disabled="registered" />
      <span v-if="passwordError" class="field__error">{{ passwordError }}</span>
      <span v-if="password && !passwordError" :class="['field__strength', `field__strength--${passwordStrength === 'Fuerte' ? 'strong' : 'weak'}`]">
        Seguridad: {{ passwordStrength }}
      </span>
    </div>

    <div v-if="errors.length" class="error-summary">
      <p v-for="error in errors" :key="error">{{ error }}</p>
    </div>

    <button type="submit" :disabled="!isValid || registered" class="btn-submit">
      {{ registered ? 'Ya registrado' : 'Regístrate' }}
    </button>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #374151;
}

.field input {
  padding: 0.6rem 0.85rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.field input:focus {
  border-color: #6366f1;
}

.field input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.field__error {
  font-size: 0.8rem;
  color: #ef4444;
}

.field__strength {
  font-size: 0.8rem;
  font-weight: 500;
}

.field__strength--strong {
  color: #22c55e;
}

.field__strength--weak {
  color: #f59e0b;
}

.error-summary {
  background-color: #fef2f2;
  border: 1px solid #ef4444;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: #b91c1c;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.btn-submit {
  padding: 0.65rem 1.5rem;
  background-color: #6366f1;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  align-self: flex-start;
}

.btn-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-submit:not(:disabled):hover {
  opacity: 0.85;
}
</style>
