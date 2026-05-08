# Unidad 3 – Formularios Web · Modificaciones extra



### Selección de producto desde catálogo JSON
Se creó el fichero `src/data/productos.json` con 20 productos de supermercado (nombre + precio).
El campo "Nombre del producto" pasó de ser un `<input type="text">` a un `<select>` que carga
las opciones directamente desde ese JSON.

**Motivo:** evitar nombres libres que podrían no coincidir con el catálogo real y facilitar
la experiencia del usuario.

### Auto-relleno del precio al seleccionar producto
Al elegir un producto en el desplegable, el campo "Precio" se rellena automáticamente con el
valor definido en el JSON.

**Implementación:**
- Se usa `v-slot` en el componente `Field` del select para combinar el handler interno de
  VeeValidate con la función `onProductoSelect`.
- `onProductoSelect` busca el producto seleccionado en el array y llama a `setFieldValue`
  (obtenido de `useForm`) para escribir el precio en el campo correspondiente.
- El campo precio sigue siendo editable por si el usuario necesita ajustarlo.

### Total del pedido dinámico
Se añade una caja de "Total del pedido" encima del botón de enviar que se actualiza en
tiempo real conforme el usuario modifica cantidades o precios.

**Implementación:**
- `useFormValues()` de VeeValidate devuelve un objeto reactivo con todos los valores del
  formulario en cada instante.
- `totalPedido` es un `computed` que itera sobre el array de productos y suma
  `cantidad × precio` de cada línea.
- La caja muestra el total formateado con `toFixed(2)`.

### Redondeo a 2 decimales en la consola
En la función `onSubmit`, tanto el `totalProducto` de cada línea como el `totalPedido`
final se redondean a 2 decimales antes de enviarse a la consola.

**Implementación:** `parseFloat(valor.toFixed(2))` — produce un `number` (no un `string`)
con exactamente 2 decimales, evitando errores de coma flotante en el log.

---

## Estructura de proyectos

```
Unit3Ejer1/
├── FormularioDeContactos/
│   └── src/
│       ├── components/ContactForm.vue
│       ├── App.vue
│       └── style.css
├── GestionDePedidos/
│   └── src/
│       ├── data/productos.json
│       ├── components/OrderForm.vue
│       ├── App.vue
│       └── style.css
└── extra.md
```

## Stack común

| Tecnología | Versión |
|---|---|
| Vue | 3.x |
| Vite | 8.x |
| TypeScript | 6.x |
| VeeValidate | 4.x |
| Yup | latest |
