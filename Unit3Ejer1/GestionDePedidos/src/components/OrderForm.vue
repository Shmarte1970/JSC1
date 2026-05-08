<template>
  <div class="form-wrapper">
    <h1>Gestión de Pedidos</h1>
    <form @submit="onSubmit" novalidate>

      <!-- ── Datos del cliente ── -->
      <section class="section">
        <h2>Datos del cliente</h2>

        <div class="form-group">
          <label for="nombre">Nombre completo</label>
          <Field
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Nombre del cliente"
            :class="['form-control', errors.nombre ? 'is-invalid' : '']"
          />
          <ErrorMessage name="nombre" class="error-msg" />
        </div>

        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <Field
            id="email"
            name="email"
            type="email"
            placeholder="cliente@email.com"
            :class="['form-control', errors.email ? 'is-invalid' : '']"
          />
          <ErrorMessage name="email" class="error-msg" />
        </div>

        <div class="form-group">
          <label for="metodoPago">Método de pago</label>
          <Field
            id="metodoPago"
            name="metodoPago"
            as="select"
            :class="['form-control', errors.metodoPago ? 'is-invalid' : '']"
          >
            <option value="" disabled>Selecciona un método</option>
            <option value="tarjeta">Tarjeta de crédito</option>
            <option value="transferencia">Transferencia bancaria</option>
            <option value="paypal">PayPal</option>
          </Field>
          <ErrorMessage name="metodoPago" class="error-msg" />
        </div>
      </section>

      <!-- ── Líneas de productos ── -->
      <section class="section">
        <h2>Líneas de productos</h2>

        <div
          v-for="(field, index) in fields"
          :key="field.key"
          class="product-row"
        >
          <div class="product-row__header">
            <span class="product-row__title">Producto {{ index + 1 }}</span>
            <button
              type="button"
              class="btn-remove"
              :disabled="fields.length === 1"
              @click="remove(index)"
            >
              Eliminar producto
            </button>
          </div>

          <!-- Select del producto con auto-relleno de precio -->
          <div class="form-group">
            <label :for="`prod-nombre-${index}`">Producto</label>
            <Field :name="`productos[${index}].nombre`" v-slot="{ field: slotField }">
              <select
                v-bind="slotField"
                :id="`prod-nombre-${index}`"
                :class="['form-control', errors[`productos[${index}].nombre`] ? 'is-invalid' : '']"
                @change="(e: Event) => onProductoSelect(index, e)"
              >
                <option value="" disabled>-- Selecciona un producto --</option>
                <option
                  v-for="p in PRODUCTOS"
                  :key="p.nombre"
                  :value="p.nombre"
                >
                  {{ p.nombre }}
                </option>
              </select>
            </Field>
            <ErrorMessage :name="`productos[${index}].nombre`" class="error-msg" />
          </div>

          <div class="product-row__nums">
            <div class="form-group">
              <label :for="`prod-cantidad-${index}`">Cantidad</label>
              <Field
                :id="`prod-cantidad-${index}`"
                :name="`productos[${index}].cantidad`"
                type="number"
                min="1"
                placeholder="0"
                :class="['form-control', errors[`productos[${index}].cantidad`] ? 'is-invalid' : '']"
              />
              <ErrorMessage :name="`productos[${index}].cantidad`" class="error-msg" />
            </div>

            <div class="form-group">
              <label :for="`prod-precio-${index}`">Precio (€)</label>
              <Field
                :id="`prod-precio-${index}`"
                :name="`productos[${index}].precio`"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                :class="['form-control', errors[`productos[${index}].precio`] ? 'is-invalid' : '']"
              />
              <ErrorMessage :name="`productos[${index}].precio`" class="error-msg" />
            </div>
          </div>
        </div>

        <button type="button" class="btn-add" @click="addProducto">
          + Añadir producto
        </button>
      </section>

      <!-- ── Total del pedido ── -->
      <div class="total-box">
        <span class="total-box__label">Total del pedido</span>
        <span class="total-box__amount">{{ totalPedido.toFixed(2) }} €</span>
      </div>

      <button type="submit" :disabled="!meta.valid" class="btn-submit">
        Enviar pedido
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useForm, Field, ErrorMessage, useFieldArray, useFormValues } from 'vee-validate'
import * as yup from 'yup'
import productosRaw from '../data/productos.json'

interface ProductoJSON {
  nombre: string
  precio: number
}

const PRODUCTOS: ProductoJSON[] = productosRaw

const productoSchema = yup.object({
  nombre: yup
    .string()
    .required('Selecciona un producto.'),
  cantidad: yup
    .number()
    .typeError('La cantidad debe ser un número.')
    .required('La cantidad es obligatoria.')
    .min(1, 'La cantidad debe ser al menos 1.'),
  precio: yup
    .number()
    .typeError('El precio debe ser un número.')
    .required('El precio es obligatorio.')
    .min(0.01, 'El precio debe ser mayor que cero.'),
})

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
  metodoPago: yup
    .string()
    .required('El método de pago es obligatorio.'),
  productos: yup
    .array()
    .of(productoSchema)
    .min(1, 'Debe haber al menos un producto.'),
})

const { errors, meta, handleSubmit, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: {
    nombre: '',
    email: '',
    metodoPago: '',
    productos: [{ nombre: '', cantidad: undefined, precio: undefined }],
  },
})

const { fields, push, remove } = useFieldArray('productos')

function addProducto() {
  push({ nombre: '', cantidad: undefined, precio: undefined })
}

// Al seleccionar un producto del dropdown se auto-rellena el precio
function onProductoSelect(index: number, event: Event) {
  const nombre = (event.target as HTMLSelectElement).value
  const found = PRODUCTOS.find((p) => p.nombre === nombre)
  if (found) {
    setFieldValue(`productos[${index}].precio` as any, found.precio)
  }
}

// Total reactivo que se recalcula con cada cambio en el formulario
const formValues = useFormValues()

const totalPedido = computed(() => {
  const prods: any[] = (formValues.value as any).productos ?? []
  return prods.reduce((sum: number, p: any) => {
    return sum + (Number(p.cantidad) || 0) * (Number(p.precio) || 0)
  }, 0)
})

const onSubmit = handleSubmit((values) => {
  const productosConTotal = values.productos!.map((p: any) => ({
    nombre: p.nombre,
    cantidad: Number(p.cantidad),
    precio: Number(p.precio),
    totalProducto: parseFloat((Number(p.cantidad) * Number(p.precio)).toFixed(2)),
  }))

  const totalPedidoFinal = parseFloat(
    productosConTotal.reduce((sum: number, p: any) => sum + p.totalProducto, 0).toFixed(2)
  )

  console.log('Pedido enviado:', {
    cliente: {
      nombre: values.nombre,
      email: values.email,
      metodoPago: values.metodoPago,
    },
    productos: productosConTotal,
    totalPedido: totalPedidoFinal,
  })
})
</script>
