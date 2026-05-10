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
 ✓ src/App.test.js (12 tests)

 Test Files  1 passed (1)
       Tests  12 passed (12)
```

## Tests incluidos

| # | Descripción |
|---|-------------|
| 1 | debe mostrar un input cuando se selecciona Cuadrado |
| 2 | debe calcular correctamente el área del Cuadrado |
| 3 | debe mostrar la fórmula correcta del Cuadrado |
| 4 | debe mostrar dos inputs cuando se selecciona Rectángulo |
| 5 | debe calcular correctamente el área del Rectángulo |
| 6 | debe mostrar la fórmula correcta del Rectángulo |
| 7 | debe mostrar un input cuando se selecciona Círculo |
| 8 | debe calcular correctamente el área del Círculo |
| 9 | debe mostrar la fórmula correcta del Círculo |
| 10 | debe mostrar dos inputs cuando se selecciona Triángulo |
| 11 | debe calcular correctamente el área del Triángulo |
| 12 | debe mostrar la fórmula correcta del Triángulo |
