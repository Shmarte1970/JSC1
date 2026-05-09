<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Cabecera -->
    <header class="bg-brand-200 shadow-md">
      <div class="max-w-5xl mx-auto px-6 py-5 flex items-center gap-4">
        <RouterLink
          to="/"
          class="flex items-center gap-2 text-brand-400 hover:text-brand-900 text-sm font-medium transition-colors"
        >
          ← Volver al listado
        </RouterLink>
        <span class="text-brand-300">|</span>
        <h1 class="text-xl font-bold text-brand-900">Ficha del Alumno</h1>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-10">
      <!-- Alumno no encontrado -->
      <div v-if="!alumno" class="bg-white rounded-xl shadow-sm border border-red-200 p-10 text-center">
        <p class="text-gray-500 text-lg">Alumno no encontrado.</p>
        <RouterLink
          to="/"
          class="inline-block mt-5 bg-brand-300 hover:bg-brand-400 text-brand-900 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          Volver al listado
        </RouterLink>
      </div>

      <!-- Tarjeta del alumno -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Banner con iniciales -->
        <div class="bg-gradient-to-r from-brand-200 to-brand-300 px-8 py-10 flex items-center gap-6">
          <div class="w-20 h-20 rounded-full bg-white/50 flex items-center justify-center text-3xl font-bold text-brand-900">
            {{ iniciales }}
          </div>
          <div>
            <h2 class="text-2xl font-bold text-brand-900">{{ alumno.nombre }}</h2>
            <p class="text-brand-400 text-sm mt-1">{{ alumno.curso }}</p>
          </div>
        </div>

        <!-- Datos en dos columnas -->
        <div class="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          <div class="px-8 py-6 space-y-5">
            <div>
              <p class="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">NIA</p>
              <p class="text-gray-800 font-medium">{{ alumno.nia }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">ID</p>
              <p class="text-gray-800 font-medium">{{ alumno.id }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Nombre completo</p>
              <p class="text-gray-800 font-medium">{{ alumno.nombre }}</p>
            </div>
          </div>
          <div class="px-8 py-6 space-y-5">
            <div>
              <p class="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Email</p>
              <p class="text-gray-800 font-medium">{{ alumno.email }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Curso</p>
              <span class="bg-brand-100 text-brand-900 text-sm px-3 py-1 rounded-full font-medium">
                {{ alumno.curso }}
              </span>
            </div>
            <div>
              <p class="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Año de matrícula</p>
              <p class="text-gray-800 font-medium">{{ alumno.año }}</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-end">
          <RouterLink
            to="/"
            class="bg-brand-300 hover:bg-brand-400 text-brand-900 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            ← Volver al listado
          </RouterLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import alumnos from '../data/alumnos.json'

const route = useRoute()

const alumno = computed(() =>
  alumnos.find(a => a.id === Number(route.params.id))
)

const iniciales = computed(() => {
  if (!alumno.value) return '?'
  return alumno.value.nombre
    .split(' ')
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('')
})
</script>
