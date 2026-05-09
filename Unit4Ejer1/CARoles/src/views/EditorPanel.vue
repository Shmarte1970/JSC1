<template>
  <div class="max-w-3xl mx-auto px-6 py-12">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Banner -->
      <div class="bg-gradient-to-r from-amber-100 to-brand-200 px-8 py-8 flex items-center gap-4">
        <div class="w-14 h-14 rounded-full bg-white/60 flex items-center justify-center text-2xl">
          ✏️
        </div>
        <div>
          <span class="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            Editor · Admin
          </span>
          <h2 class="text-xl font-bold text-brand-900 mt-1">Panel de Editor</h2>
        </div>
      </div>

      <div class="px-8 py-6 space-y-4">
        <p class="text-gray-600 text-sm">
          Bienvenido, <strong>{{ user.nombre }}</strong>.
          Tienes acceso a este panel porque tu rol es
          <span class="font-semibold text-amber-600">{{ user.role }}</span>.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Artículos</p>
            <p class="text-2xl font-bold text-brand-900">142</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Borradores</p>
            <p class="text-2xl font-bold text-brand-900">8</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Publicados hoy</p>
            <p class="text-2xl font-bold text-brand-900">3</p>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-end">
        <RouterLink
          to="/"
          class="bg-brand-300 hover:bg-brand-400 text-brand-900 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          ← Volver al inicio
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { currentUser } from '../services/auth'

const user = currentUser
</script>
