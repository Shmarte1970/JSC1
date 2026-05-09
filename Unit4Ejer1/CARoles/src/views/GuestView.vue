<template>
  <div class="max-w-3xl mx-auto px-6 py-12">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-10">
      <h2 class="text-2xl font-bold text-brand-900 mb-2">Bienvenido</h2>
      <p class="text-gray-500 text-sm mb-8">
        Página pública accesible por todos los usuarios.
        Selecciona un usuario en la barra superior para explorar las áreas protegidas.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Panel Editor -->
        <div class="border border-gray-200 rounded-xl p-5">
          <div class="flex items-center gap-3 mb-3">
            <span class="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              Editor · Admin
            </span>
          </div>
          <h3 class="font-semibold text-gray-800 mb-1">Panel de Editor</h3>
          <p class="text-xs text-gray-400 mb-4">Acceso exclusivo para editores y administradores.</p>
          <RouterLink
            to="/admin/editor"
            class="inline-block bg-brand-300 hover:bg-brand-400 text-brand-900 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Ir al panel →
          </RouterLink>
        </div>

        <!-- Panel Admin -->
        <div class="border border-gray-200 rounded-xl p-5">
          <div class="flex items-center gap-3 mb-3">
            <span class="bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              Solo Admin
            </span>
          </div>
          <h3 class="font-semibold text-gray-800 mb-1">Configuración Admin</h3>
          <p class="text-xs text-gray-400 mb-4">Acceso exclusivo para administradores.</p>
          <RouterLink
            to="/admin/config"
            class="inline-block bg-brand-300 hover:bg-brand-400 text-brand-900 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Ir a configuración →
          </RouterLink>
        </div>
      </div>

      <!-- Estado actual -->
      <div class="mt-8 p-4 bg-brand-50 rounded-xl border border-brand-100">
        <p class="text-xs text-brand-900 font-semibold uppercase tracking-wide mb-2">Estado actual</p>
        <p v-if="user.isAuthenticated" class="text-sm text-gray-700">
          Conectado como <strong>{{ user.nombre }}</strong> —
          <span :class="roleBadgeClass">{{ user.role }}</span>
        </p>
        <p v-else class="text-sm text-gray-500">No autenticado — usa el selector de usuario.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { currentUser } from '../services/auth'

const user = currentUser

const roleBadgeClass = computed(() => {
  const map: Record<string, string> = {
    Admin:  'font-semibold text-red-600',
    Editor: 'font-semibold text-amber-600',
    Guest:  'font-semibold text-gray-500',
  }
  return map[user.role] ?? 'font-semibold text-gray-500'
})
</script>
