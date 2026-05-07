<script setup lang="ts">
import { ref } from 'vue';
import SignUpForm from './components/SignUpForm.vue';
import type { User } from './models/user.interface';

const registered = ref(false);
const registeredUser = ref<User | null>(null);
const formRef = ref<InstanceType<typeof SignUpForm> | null>(null);

function handleRegister(user: User) {
  registeredUser.value = user;
  registered.value = true;
}

function handleNewRegister() {
  registered.value = false;
  registeredUser.value = null;
  formRef.value?.reset();
}
</script>

<template>
  <main>
    <h1>Registro de Usuarios</h1>

    <div :class="['banner', registered ? 'banner--success' : 'banner--pending']">
      <p class="banner__title">{{ registered ? 'Registro Completado' : 'Pendiente de Registrarse' }}</p>
      <p class="banner__subtitle">
        {{ registered ? `Bienvenido, ${registeredUser!.name}` : 'Completa el formulario para registrarte' }}
      </p>
      <button v-if="registered" class="btn-new" @click="handleNewRegister">Nuevo Registro</button>
    </div>

    <SignUpForm ref="formRef" :registered="registered" @register="handleRegister" />
  </main>
</template>

<style scoped>
main {
  max-width: 480px;
  margin: 3rem auto;
  padding: 0 1rem;
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

h1 {
  font-size: 1.5rem;
  color: #1e293b;
  margin: 0;
}

.banner {
  border-radius: 8px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.banner--pending {
  background-color: #f1f5f9;
  border-left: 4px solid #94a3b8;
  color: #475569;
}

.banner--success {
  background-color: #ecfdf5;
  border-left: 4px solid #22c55e;
  color: #15803d;
}

.banner__title {
  font-weight: 700;
  font-size: 1rem;
  margin: 0;
}

.banner__subtitle {
  font-size: 0.9rem;
  margin: 0;
}

.btn-new {
  margin-top: 0.75rem;
  align-self: flex-start;
  padding: 0.45rem 1rem;
  background-color: #22c55e;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-new:hover {
  opacity: 0.85;
}
</style>
