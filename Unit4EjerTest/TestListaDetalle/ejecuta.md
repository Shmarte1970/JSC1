# Cómo lanzar los tests

## Requisitos previos

Tener [Node.js](https://nodejs.org) instalado.

## Instalar dependencias (solo la primera vez)

```bash
npm install
```

## Ejecutar los tests

### Modo ejecución única

Lanza todos los tests una vez y muestra el resultado:

```bash
npm run test:run
```

### Modo watch (desarrollo)

Queda en escucha y re-ejecuta los tests cada vez que guardas un fichero:

```bash
npm test
```

## Resultado esperado

```
 ✓ src/__tests__/views/DetalleView.test.js (2 tests)
 ✓ src/__tests__/views/ListaView.test.js (2 tests)

 Test Files  2 passed (2)
       Tests  4 passed (4)
```

## Tests incluidos

### ListaView — `src/__tests__/views/ListaView.test.js`

| # | Descripción |
|---|-------------|
| 1 | debería mostrar la lista de estudiantes en la ruta raíz "/" |
| 2 | debería navegar al detalle del estudiante al hacer clic en un enlace |

### DetalleView — `src/__tests__/views/DetalleView.test.js`

| # | Descripción |
|---|-------------|
| 3 | debería mostrar el detalle del estudiante en la ruta "/alumno/:id" |
| 4 | debería navegar de vuelta a la lista al hacer clic en "Volver al listado" |

## Notas técnicas

- Se usa `createMemoryHistory` en lugar de `createWebHistory` para que el router funcione en un entorno de tests sin navegador real.
- `flushPromises` de `@vue/test-utils` asegura que la navegación asíncrona del router se complete antes de comprobar el DOM.
- Los tests están organizados siguiendo la misma estructura que las vistas del proyecto (`src/views/`).
