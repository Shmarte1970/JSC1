<template>
  <div class="form-wrapper">
    <h1>Crear Incidencia</h1>
    <form @submit="onSubmit" novalidate>

      <!-- Asunto -->
      <div class="form-group">
        <label for="asunto">Asunto</label>
        <Field
          id="asunto"
          name="asunto"
          type="text"
          placeholder="Asunto de la incidencia"
          :class="['form-control', errors.asunto ? 'is-invalid' : '']"
        />
        <ErrorMessage name="asunto" class="error-msg" />
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

      <!-- Categoría -->
      <div class="form-group">
        <label for="categoria">Categoría</label>
        <Field
          id="categoria"
          name="categoria"
          as="select"
          :class="['form-control', errors.categoria ? 'is-invalid' : '']"
        >
          <option value="" disabled>Selecciona una categoría</option>
          <option value="error_tecnico">Error técnico</option>
          <option value="consulta">Consulta</option>
          <option value="facturacion">Facturación</option>
        </Field>
        <ErrorMessage name="categoria" class="error-msg" />
      </div>

      <!-- Número de factura — solo si categoría = facturación -->
      <Transition name="fade">
        <div v-if="categoriaValue === 'facturacion'" class="form-group form-group--conditional">
          <label for="numeroFactura">Número de factura</label>
          <Field
            id="numeroFactura"
            name="numeroFactura"
            type="text"
            placeholder="Ej: AB1234"
            maxlength="6"
            :class="['form-control', errors.numeroFactura ? 'is-invalid' : '']"
          />
          <span class="field-hint">6 caracteres alfanuméricos (letras y números)</span>
          <ErrorMessage name="numeroFactura" class="error-msg" />
        </div>
      </Transition>

      <!-- Versión del programa — solo si categoría = error técnico -->
      <Transition name="fade">
        <div v-if="categoriaValue === 'error_tecnico'" class="form-group form-group--conditional">
          <label for="versionPrograma">Versión del programa</label>
          <Field
            id="versionPrograma"
            name="versionPrograma"
            type="text"
            placeholder="Ej: 3.2.1"
            :class="['form-control', errors.versionPrograma ? 'is-invalid' : '']"
          />
          <span class="field-hint">Debe contener al menos un dígito</span>
          <ErrorMessage name="versionPrograma" class="error-msg" />
        </div>
      </Transition>

      <!-- Detalle -->
      <div class="form-group">
        <label for="detalle">Detalle</label>
        <textarea
          id="detalle"
          :value="detalleValue"
          @input="detalleHandleChange"
          @blur="detalleHandleBlur"
          rows="5"
          placeholder="Describe la incidencia con detalle..."
          :class="['form-control', detalleError ? 'is-invalid' : '']"
        ></textarea>
        <span class="char-counter" :class="{ 'char-counter--ok': detalleChars >= DETALLE_MIN }">
          {{ detalleChars }} caracteres
          <span v-if="detalleChars < DETALLE_MIN"> — mínimo {{ DETALLE_MIN }}</span>
        </span>
        <span v-if="detalleError" class="error-msg">{{ detalleError }}</span>
      </div>

      <button type="submit" :disabled="!meta.valid" class="btn-submit">
        Crear incidencia
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue'
import { useForm, Field, ErrorMessage, useField } from 'vee-validate'
import * as yup from 'yup'

const schema = yup.object({
  asunto: yup
    .string()
    .required('El asunto es obligatorio.')
    .min(5, 'El asunto debe tener al menos 5 caracteres.')
    .max(100, 'El asunto no puede superar los 100 caracteres.'),
  email: yup
    .string()
    .required('El correo electrónico es obligatorio.')
    .email('El formato del correo electrónico no es válido.'),
  categoria: yup
    .string()
    .required('La categoría es obligatoria.'),

  // Número de factura: requerido y alfanumérico de 6 chars solo si categoría = facturación
  // Forma canónica v1: function builder con array desestructurado ([categoria], schema)
  // excludeEmptyString evita que matches() dispare un error extra cuando required() ya falla
  numeroFactura: yup.string().when('categoria', ([categoria], schema) =>
    categoria === 'facturacion'
      ? schema
          .required('El número de factura es obligatorio.')
          .matches(/^[a-zA-Z0-9]{6}$/, {
            message: 'Debe tener exactamente 6 caracteres alfanuméricos.',
            excludeEmptyString: true,
          })
      : schema.notRequired(),
  ),

  // Versión del programa: requerida y con al menos 1 dígito solo si categoría = error técnico
  versionPrograma: yup.string().when('categoria', ([categoria], schema) =>
    categoria === 'error_tecnico'
      ? schema
          .required('La versión del programa es obligatoria.')
          .matches(/\d/, {
            message: 'Debe contener al menos un carácter numérico.',
            excludeEmptyString: true,
          })
      : schema.notRequired(),
  ),

  detalle: yup
    .string()
    .required('El detalle es obligatorio.')
    .min(20, 'El detalle debe tener al menos 20 caracteres.'),
})

const { errors, meta, handleSubmit, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: {
    asunto: '',
    email: '',
    categoria: '',
    numeroFactura: '',
    versionPrograma: '',
    detalle: '',
  },
})

// Acceso reactivo al valor de categoría para mostrar/ocultar campos condicionales
const { value: categoriaValue } = useField<string>('categoria')

// Acceso reactivo al campo detalle para el contador de palabras
const {
  value: detalleValue,
  errorMessage: detalleError,
  handleChange: detalleHandleChange,
  handleBlur: detalleHandleBlur,
} = useField<string>('detalle')

const DETALLE_MIN = 20

const detalleChars = computed(() => detalleValue.value?.length ?? 0)

// Al cambiar de categoría se limpian los campos condicionales
watch(categoriaValue, () => {
  setFieldValue('numeroFactura', '')
  setFieldValue('versionPrograma', '')
})

const onSubmit = handleSubmit((values) => {
  const payload: Record<string, unknown> = {
    asunto: values.asunto,
    email: values.email,
    categoria: values.categoria,
    detalle: values.detalle,
  }

  if (values.categoria === 'facturacion') {
    payload.numeroFactura = values.numeroFactura
  }
  if (values.categoria === 'error_tecnico') {
    payload.versionPrograma = values.versionPrograma
  }

  console.log('Incidencia creada:', payload)
})
</script>
