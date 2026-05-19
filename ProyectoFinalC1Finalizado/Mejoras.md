# Mejoras sobre los requisitos del Proyecto Final C1

Detalle de las funcionalidades añadidas que van **que mejoran el projecto** del proyecto.

---

## 1. Eliminación de datos con confirmación de texto

### Qué pide el PDF
Mostrar una confirmación antes de eliminar los datos del usuario.

### Qué hemos implementado
Sistema de confirmación copiado del procedimiento de borrado de GitHub: el usuario debe escribir una frase exacta para poder pulsar el botón de eliminación. Esto evita eliminaciones accidentales.

### Cómo se usa
1. Ir a **Perfil** → sección **Zona de peligro**
2. Pulsar **"Eliminar mis datos"**
3. Se despliega un campo de texto con la instrucción:
   > Escribe **Eliminar mis datos tu@email.com** para confirmar
4. El botón **"Sí, eliminar todos mis datos"** permanece deshabilitado hasta que el texto introducido coincide exactamente con la frase indicada
5. Al confirmar, se eliminan todos los datos y se redirige al login automáticamente

---

## 2. Imágenes automáticas en los productos

### Qué pide el PDF
Mostrar productos con nombre, unidad y descripción.

### Qué he implementado
29 imágenes SVG agrupadas por categoría (Frutas, Lácteos, Carnes, Verduras, etc.) que se asignan automáticamente al producto según su nombre. La coincidencia es tolerante: ignora tildes, mayúsculas y plurales.

**Categorías disponibles:** Frutas, Verduras y Hortalizas, Lácteos y Huevos, Carnes y Pescados, Panadería y Cereales, Bebidas, Limpieza e Higiene, Otros.

### Cómo se usa
- El sistema asigna la imagen **automáticamente** al crear el producto si el nombre coincide con uno de los 29 productos del catálogo interno
- Si el nombre no coincide exactamente, se muestra un icono genérico de cesta
- Para ver qué nombres tienen las imagenes → usa la función **`/list`** (ver punto 3)
- Las imágenes aparecen tanto en el **catálogo de productos** como en las **filas de la lista de la compra**

---

## 3. Modal `/list` — Explorador de productos con imagen

### Qué pide el PDF
Nada. Esta funcionalidad no existe en los requisitos.

### Qué he implementado
Un modal accesible desde el catálogo de productos que muestra todos los productos que tienen imagen SVG disponible, agrupados por categoría. Sirve para saber exactamente qué nombre usar al crear un producto para que se le asigne imagen automáticamente.

### Cómo se usa
1. Ir a **Catálogo de productos**
2. En el buscador, escribir exactamente: `/list`
3. Se abre el modal automáticamente y el buscador se limpia
4. El modal muestra los 29 productos agrupados por categoría con su imagen y nombre
5. También hay un buscador interno para filtrar por nombre
6. Se puede cerrar pulsando **✕** o haciendo clic fuera del modal
7. Alternativa: en el estado vacío del catálogo aparece el enlace **"Ver ejemplos de productos"**

> **Uso recomendado:** antes de crear un producto nuevo, abrir `/list` para ver si existe con imagen disponible y copiar el nombre exacto.

---

## 4. Precio de referencia en productos y auto-relleno en listas

### Qué pide el PDF
Introducir precio manualmente cada vez que se añade un producto a una lista.

### Implementado
Sistema de precio de referencia en tres capas:

**Capa 1 — Precio guardado en el producto**
Al crear o editar un producto, el campo **"Precio de referencia (€)"** guarda el precio habitual. Internamente se almacena en el campo `description` de la API (que es el único campo libre disponible en el modelo de producto de la API de la UOC).

**Capa 2 — Auto-relleno al seleccionar producto**
Al seleccionar un producto en el panel "Añadir producto a la lista", el campo precio se rellena automáticamente con el precio de referencia guardado en el producto.

**Capa 3 — Caché en localStorage**
Si un producto no tiene precio de referencia guardado pero se ha usado antes en una lista, el sistema recuerda el último precio introducido en el navegador y lo usa como valor por defecto.

**Subtotal en tiempo real**
Mientras el usuario ajusta cantidad y precio, se muestra el subtotal calculado al momento:
```
6 × 0.10 € = 0.60 €
```

### Cómo se usa
1. **Al crear un producto:** rellenar el campo **"Precio de referencia (€)"** con el precio habitual (ej: `0.10`)
2. **Al añadir a la lista:** seleccionar el producto → el precio se rellena solo
3. Ajustar la cantidad → el subtotal se calcula automáticamente
4. Si el precio del día es diferente, se puede modificar manualmente antes de añadir
5. El nuevo precio queda guardado en caché para la próxima vez

---

## 5. Estadísticas en tiempo real en las tarjetas de lista

### Qué pide el PDF
Tarjetas de lista con título y fecha.

### Implementado
Cada tarjeta de lista muestra el **número de productos** y el **importe total** cargados en background para no bloquear la pantalla.

- Al entrar en "Mis listas", las tarjetas aparecen de inmediato con el texto *"cargando estadísticas…"*
- En paralelo, se cargan los detalles de cada lista
- Una vez cargados, se muestra `📦 3 productos` y `5.40 €`
- Si falla la carga de una lista concreta, el resto no se ve afectado

---

## 6. Edición inline

### Qué pide el PDF
Edición en página separada o formulario fijo.

### Qué he implementado
Tanto en las listas como en los ítems de una lista, al pulsar el botón de editar ✏️, la propia tarjeta o fila se transforma en un formulario de edición en el mismo sitio, sin navegar a otra página ni perder el contexto de la pantalla.

---

## 7. Mostrar/ocultar contraseña

### Qué pide el PDF
Campos de contraseña estándar.

### Qué he implementado
Icono de ojo en los campos de contraseña de **registro** y **login** para alternar entre texto visible y oculto.

---

## 8. Panel de usuarios de prueba en el Login

### Qué pide el PDF
Formulario de login estándar.

### Implementado
Un panel desplegable en la pantalla de login con usuarios de prueba predefinidos. Al hacer clic en uno, rellena automáticamente email y contraseña en el formulario.

> **Nota:** los usuarios deben estar registrados previamente en la API para poder iniciar sesión.

---

## Resumen de mejoras

| Mejora | Dónde se ve |
|---|---|
| Confirmación de texto para eliminar datos | Perfil → Zona de peligro |
| Imágenes SVG automáticas | Catálogo + detalle de lista |
| Modal `/list` con explorador de productos | Catálogo → buscador |
| Precio de referencia + auto-relleno | Crear producto + Añadir a lista |
| Subtotal en tiempo real | Panel "Añadir producto" en detalle de lista |
| Estadísticas en background en tarjetas | Vista "Mis listas" |
| Edición inline | Listas + ítems de lista |
| Mostrar/ocultar contraseña | Login + Registro |
| Panel de usuarios de prueba | Login |
