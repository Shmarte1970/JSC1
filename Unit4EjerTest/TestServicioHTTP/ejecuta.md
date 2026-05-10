# Cómo lanzar los tests

## Requisitos previos

Tener [Node.js](https://nodejs.org) instalado.

## Instalar dependencias (solo la primera vez)

```bash
npm install
```

## Ejecutar los tests

### Modo ejecución única

```bash
npm run test:run
```

### Modo watch (desarrollo)

```bash
npm test
```

## Resultado esperado

```
 ✓ src/__tests__/services/userService.test.js (2 tests)

 Test Files  1 passed (1)
       Tests  2 passed (2)
```

## Tests incluidos

### userService — `src/__tests__/services/userService.test.js`

| # | Descripción |
|---|-------------|
| 1 | debería devolver la lista de usuarios cuando la respuesta es correcta |
| 2 | debería lanzar un error cuando la respuesta del servidor falla |

## Cómo funciona el mock de fetch

Los tests **nunca llaman a la API real**. En su lugar, usamos `vi.stubGlobal('fetch', ...)` para
sustituir `fetch` por una función falsa que devuelve los datos que nosotros controlamos:

```js
// Simular respuesta correcta
vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
  ok: true,
  json: vi.fn().mockResolvedValue([{ id: 1, name: 'Alice' }]),
}))

// Simular error del servidor
vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
  ok: false,
  status: 500,
}))
```

La opción `unstubGlobals: true` en `vitest.config.js` restaura el `fetch` original
automáticamente después de cada test, evitando que un mock afecte a los demás.
