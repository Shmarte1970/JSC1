<template>
  <div class="card">
    <div class="card-header">
      <h1>Calculadora de Áreas</h1>
      <p>Calcula áreas de figuras geométricas</p>
    </div>

    <div class="card-body">
      <p class="seccion-label">Selecciona una figura:</p>

      <div class="figura-grid">
        <button
          v-for="f in figuras"
          :key="f.id"
          :class="{ activo: figura === f.id }"
          @click="figura = f.id"
        >
          {{ f.label }}
        </button>
      </div>

      <div class="inputs">
        <div v-if="figura === 'cuadrado'" class="campo">
          <label>Lado (l)</label>
          <input type="number" v-model.number="lado" min="0" placeholder="0" />
        </div>

        <template v-if="figura === 'rectangulo' || figura === 'triangulo'">
          <div class="campo">
            <label>Base (b)</label>
            <input type="number" v-model.number="base" min="0" placeholder="0" />
          </div>
          <div class="campo">
            <label>Altura (h)</label>
            <input type="number" v-model.number="altura" min="0" placeholder="0" />
          </div>
        </template>

        <div v-if="figura === 'circulo'" class="campo">
          <label>Radio (r)</label>
          <input type="number" v-model.number="radio" min="0" placeholder="0" />
        </div>
      </div>

      <div class="resultado">
        <p class="formula">{{ formulaDetalle }}</p>
        <p class="area-valor">{{ area.toFixed(2) }}</p>
        <p class="unidades">unidades cuadradas</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const figuras = [
  { id: 'cuadrado',   label: 'Cuadrado'   },
  { id: 'rectangulo', label: 'Rectángulo'  },
  { id: 'circulo',    label: 'Círculo'     },
  { id: 'triangulo',  label: 'Triángulo'   },
]

const figura  = ref('cuadrado')
const lado    = ref(0)
const base    = ref(0)
const altura  = ref(0)
const radio   = ref(0)

const area = computed(() => {
  switch (figura.value) {
    case 'cuadrado':   return lado.value * lado.value
    case 'rectangulo': return base.value * altura.value
    case 'circulo':    return Math.PI * radio.value * radio.value
    case 'triangulo':  return (base.value * altura.value) / 2
    default:           return 0
  }
})

const formulaDetalle = computed(() => {
  switch (figura.value) {
    case 'cuadrado':
      return `Área = l² = ${lado.value} × ${lado.value}`
    case 'rectangulo':
      return `Área = b × h = ${base.value} × ${altura.value}`
    case 'circulo':
      return `Área = π × r² = π × ${radio.value}²`
    case 'triangulo':
      return `Área = (b × h) / 2 = (${base.value} × ${altura.value}) / 2`
    default:
      return ''
  }
})
</script>
