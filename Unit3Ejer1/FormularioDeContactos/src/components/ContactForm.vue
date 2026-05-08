<template>
  <div class="form-wrapper">
    <h1>Formulario de Contacto</h1>
    <form @submit="onSubmit" novalidate>

      <!-- Nombre completo -->
      <div class="form-group">
        <label for="nombre">Nombre completo</label>
        <Field
          id="nombre"
          name="nombre"
          type="text"
          placeholder="Tu nombre completo"
          :class="['form-control', errors.nombre ? 'is-invalid' : '']"
        />
        <ErrorMessage name="nombre" class="error-msg" />
      </div>

      <!-- Correo electrónico -->
      <div class="form-group">
        <label for="email">Correo electrónico</label>
        <Field
          id="email"
          name="email"
          type="email"
          placeholder="tu@email.com"
          :class="['form-control', errors.email ? 'is-invalid' : '']"
        />
        <ErrorMessage name="email" class="error-msg" />
      </div>

      <!-- Asunto -->
      <div class="form-group">
        <label for="asunto">Asunto</label>
        <Field
          id="asunto"
          name="asunto"
          type="text"
          placeholder="Asunto del mensaje"
          :class="['form-control', errors.asunto ? 'is-invalid' : '']"
        />
        <ErrorMessage name="asunto" class="error-msg" />
      </div>

      <!-- Mensaje -->
      <div class="form-group">
        <label for="mensaje">Mensaje</label>
        <textarea
          id="mensaje"
          :value="mensajeValue"
          @input="mensajeHandleChange"
          @blur="mensajeHandleBlur"
          rows="5"
          :maxlength="MENSAJE_MAX"
          placeholder="Escribe tu mensaje aquí..."
          :class="['form-control', mensajeError ? 'is-invalid' : '']"
        ></textarea>
        <span class="char-counter" :class="{ 'char-counter--warning': mensajeRestantes <= 50 }">
          {{ mensajeRestantes }} / {{ MENSAJE_MAX }} caracteres restantes
        </span>
        <span v-if="mensajeError" class="error-msg">{{ mensajeError }}</span>
      </div>

      <button type="submit" :disabled="!meta.valid" class="btn-submit">
        Enviar
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useForm, Field, ErrorMessage, useField } from 'vee-validate'
import * as yup from 'yup'

const MENSAJE_MAX = 500

const schema = yup.object({
  nombre: yup
    .string()
    .required('El nombre es obligatorio.')
    .min(3, 'El nombre debe tener al menos 3 caracteres.')
    .max(100, 'El nombre no puede superar los 100 caracteres.'),
  email: yup
    .string()
    .required('El correo electrónico es obligatorio.')
    .email('El formato del correo electrónico no es válido.'),
  asunto: yup
    .string()
    .required('El asunto es obligatorio.'),
  mensaje: yup
    .string()
    .required('El mensaje es obligatorio.')
    .min(20, 'El mensaje debe tener al menos 20 caracteres.')
    .max(MENSAJE_MAX, `El mensaje no puede superar los ${MENSAJE_MAX} caracteres.`),
})

const { errors, meta, handleSubmit } = useForm({
  validationSchema: schema,
})

const {
  value: mensajeValue,
  errorMessage: mensajeError,
  handleChange: mensajeHandleChange,
  handleBlur: mensajeHandleBlur,
} = useField<string>('mensaje')

const mensajeRestantes = computed(() => MENSAJE_MAX - (mensajeValue.value?.length ?? 0))

const onSubmit = handleSubmit((values) => {
  console.log('Formulario enviado:', values)
})
</script>
