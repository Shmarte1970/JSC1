<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />

    <!-- Hero -->
    <section class="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-20 gap-6 overflow-hidden">
      <!-- Logo Vue de fondo -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 261.76 226.69"
        class="absolute inset-0 m-auto w-[520px] h-auto opacity-[0.095] pointer-events-none select-none"
        aria-hidden="true"
      >
        <path d="M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z" fill="#41b883"/>
        <path d="M161.096.001l-30.225 52.351L100.647.001H52.346l78.526 136.01L209.398.001z" fill="#34495e"/>
      </svg>

      <div class="relative text-7xl">🛒</div>
      <h1 class="relative text-4xl font-bold text-gray-800 max-w-xl leading-tight">
        Tu lista de la compra, siempre organizada
      </h1>
      <p class="relative text-gray-500 text-lg max-w-md">
        Crea listas, añade productos, controla cantidades y precios.
        Todo en un solo lugar, desde cualquier dispositivo.
      </p>
      <div class="relative flex gap-3 mt-2">
        <RouterLink :to="{ name: 'register' }" class="btn btn-primary btn-lg">
          Empezar gratis
        </RouterLink>
        <RouterLink :to="{ name: 'login' }" class="btn btn-outline btn-lg">
          Iniciar sesión
        </RouterLink>
      </div>
    </section>

    <!-- Características -->
    <section class="max-w-4xl mx-auto w-full px-4 pb-20 grid sm:grid-cols-3 gap-6">
      <div class="card text-center gap-3 flex flex-col items-center">
        <div class="text-4xl">📦</div>
        <h3 class="font-semibold text-gray-700">Catálogo de productos</h3>
        <p class="text-sm text-gray-400">Crea tu catálogo personalizado con imágenes y unidades de medida.</p>
      </div>
      <div class="card text-center gap-3 flex flex-col items-center">
        <div class="text-4xl">📋</div>
        <h3 class="font-semibold text-gray-700">Gestión de listas</h3>
        <p class="text-sm text-gray-400">Organiza tus compras en listas separadas con totales automáticos.</p>
      </div>
      <div class="card text-center gap-3 flex flex-col items-center">
        <div class="text-4xl">💰</div>
        <h3 class="font-semibold text-gray-700">Control de gastos</h3>
        <p class="text-sm text-gray-400">Introduce precios y calcula el coste total de cada lista al instante.</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
      {{ new Date().getFullYear() }} · Lista de la Compra · Proyecto Final C1 UOC
    </footer>
  </div>
</template>
