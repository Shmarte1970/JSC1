<template>
  <div class="max-w-3xl mx-auto px-6 py-12">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Banner -->
      <div class="bg-gradient-to-r from-red-100 to-brand-200 px-8 py-8 flex items-center gap-4">
        <div class="w-14 h-14 rounded-full bg-white/60 flex items-center justify-center text-2xl">
          ⚙️
        </div>
        <div>
          <span class="bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            Solo Admin
          </span>
          <h2 class="text-xl font-bold text-brand-900 mt-1">Configuración de Administrador</h2>
        </div>
      </div>

      <div class="px-8 py-6 space-y-4">
        <p class="text-gray-600 text-sm">
          Bienvenido, <strong>{{ user.nombre }}</strong>.
          Tienes acceso completo porque tu rol es
          <span class="font-semibold text-red-600">{{ user.role }}</span>.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Usuarios registrados</p>
            <p class="text-2xl font-bold text-brand-900">6</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Roles activos</p>
            <p class="text-2xl font-bold text-brand-900">3</p>
          </div>
        </div>

        <!-- Tabla de usuarios -->
        <div class="mt-4 border border-gray-200 rounded-xl overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                <th class="px-4 py-2 text-left">Usuario</th>
                <th class="px-4 py-2 text-left">Rol</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="u in users"
                :key="u.nombre"
                class="border-t border-gray-100 hover:bg-brand-50"
              >
                <td class="px-4 py-2 text-gray-700">{{ u.nombre }}</td>
                <td class="px-4 py-2">
                  <span :class="roleClass(u.role)" class="text-xs font-semibold px-2 py-0.5 rounded-full">
                    {{ u.role }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
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
import { currentUser, USERS } from '../services/auth'

const user  = currentUser
const users = USERS

function roleClass(role: string): string {
  const map: Record<string, string> = {
    Admin:  'bg-red-100 text-red-700',
    Editor: 'bg-amber-100 text-amber-700',
    Guest:  'bg-gray-100 text-gray-600',
  }
  return map[role] ?? 'bg-gray-100 text-gray-600'
}
</script>
