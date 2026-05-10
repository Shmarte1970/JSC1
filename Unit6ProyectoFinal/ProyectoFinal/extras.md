# Funcionalidades Extra – Unit6 Proyecto Final

> Funcionalidades implementadas más allá de lo solicitado en el enunciado del PDF.
> El proyecto cumple al ~98 % los 4 ejercicios del PDF; el resto son mejoras de UX y robustez añadidas durante el desarrollo.

---

## 1. Formulario de creación de tareas

**¿Qué aporta?**
El enunciado solo pedía filtrar y ordenar tareas existentes. Se añadió un formulario completo para crear nuevas tareas desde la interfaz.

**Implementación:**
- Campos: nombre (requerido), descripción, fecha límite (`<input type="date">`), prioridad (`<select>`: baja / media / alta).
- Botón "Crear" deshabilitado mientras `name` esté vacío.
- La nueva tarea se inserta con `status: 'pending'` al inicio del array reactivo `tasks`.

```typescript
function createTask(): void {
  if (!newTask.name.trim()) return
  tasks.value.unshift({
    id:          Date.now(),
    name:        newTask.name.trim(),
    description: newTask.description.trim(),
    dueDate:     newTask.dueDate,
    priority:    newTask.priority,
    status:      'pending',
  })
  // reset form
}
```

---

## 2. Sistema de estado Pendiente / Hecha

**¿Qué aporta?**
Las tareas tienen dos estados visuales: `pending` (pendiente) y `done` (hecha). Las tareas completadas aparecen con opacidad reducida y texto tachado.

**Implementación:**
- Campo `status: 'pending' | 'done'` añadido al tipo `Task`.
- Botón ✓ en cada fila/tarjeta que llama a `toggleStatus(id)`.
- Vista lista: fila con `opacity-60 line-through` cuando `status === 'done'`.
- Vista tarjetas: badge de color verde (Hecha) / amarillo (Pendiente).

```typescript
function toggleStatus(id: number): void {
  const task = tasks.value.find(t => t.id === id)
  if (task) task.status = task.status === 'pending' ? 'done' : 'pending'
}
```

---

## 3. Acciones masivas sobre tareas

**¿Qué aporta?**
Tres botones de acción colectiva para gestionar la lista completa de tareas.

| Botón | Acción |
|---|---|
| Completar todas | Marca todas las tareas visibles como `done` |
| Eliminar completadas | Elimina del array todas las tareas con `status === 'done'` |
| ↺ Recargar | Restaura la lista original desde `tasks.json` |

```typescript
function completeAll():   void { tasks.value.forEach(t => { t.status = 'done' }) }
function deleteDone():    void { tasks.value = tasks.value.filter(t => t.status !== 'done') }
function reloadTasks():   void { tasks.value = INITIAL_TASKS.map(t => ({ ...t })) }
```

---

## 4. Ordenación por cabeceras de columna

**¿Qué aporta?**
Además del panel de filtros del Ej.3, se puede ordenar haciendo clic directamente en los títulos de columna de la vista lista.

**Implementación:**
- Columnas clicables: **Tarea**, **Prioridad**, **Fecha límite**.
- Ciclo de estado por clic: `null → asc → desc → null`.
- Indicador visual: ↕ (sin orden) / ↑ (asc) / ↓ (desc).
- El estado compartido con el panel de filtros: cambiar uno actualiza el otro.

```typescript
const CYCLE: Record<string, 'asc' | 'desc' | null> = { null: 'asc', asc: 'desc', desc: null }

function toggleColumnSort(col: 'name' | 'priority' | 'dueDate'): void {
  if (col === 'name')     nameSort.value     = CYCLE[String(nameSort.value)]
  if (col === 'priority') prioritySort.value = CYCLE[String(prioritySort.value)]
  if (col === 'dueDate')  dateSort.value     = CYCLE[String(dateSort.value)]
}
```

---

## 5. Panel de filtros con chips activos

**¿Qué aporta?**
El enunciado pedía filtrar por fecha y prioridad pero no especificaba la UX. Se implementó un panel colapsable con chips que muestran los filtros activos y permiten eliminarlos individualmente.

**Implementación:**
- Botón "Filtros" con contador de filtros activos (`activeFiltersCount`).
- Panel expandible con botones de selección de orden para fecha y prioridad.
- Chips activos debajo del buscador: `↑ Más antigua ✕`, `↓ Mayor a menor ✕`, etc.
- Botón "Limpiar orden" para resetear todos los filtros a la vez.

---

## 6. Perfil de usuario editable con persistencia entre sesiones

**¿Qué aporta?**
El enunciado solo pedía mostrar los datos del usuario. Se añadió edición de campos y persistencia real entre sesiones.

**Campos editables:** Nombre completo, Teléfono, Alias.
**Campos de solo lectura:** Correo electrónico, ID (UUID), Activo.

**Arquitectura de doble clave en localStorage:**

| Clave | Contenido | Ciclo de vida |
|---|---|---|
| `taskapp_user` | Sesión activa completa | Se elimina al hacer logout |
| `taskapp_profile_{email}` | `{ fullName, phone, alias }` | Persiste siempre |

Al hacer login, `getSavedProfile(email)` restaura los datos editados automáticamente.

```typescript
export function updateUser(data: Pick<User, 'fullName' | 'phone' | 'alias'>): void {
  const user = getUser()
  if (!user) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...user, ...data }))
  localStorage.setItem(
    PROFILE_KEY_PREFIX + user.email,
    JSON.stringify({ fullName: data.fullName, phone: data.phone, alias: data.alias }),
  )
}
```

---

## 7. Login con email O nombre completo (incluyendo nombre editado)

**¿Qué aporta?**
El enunciado usaba solo email. Se permite autenticarse con el nombre completo, incluso si el usuario lo ha cambiado en su perfil.

**Búsqueda en dos pasos:**
1. Buscar en `USERS[]` por email exacto o nombre original (case-insensitive + trim).
2. Si no coincide, buscar en los perfiles persistentes `taskapp_profile_*` por el nombre editado.

```typescript
// Paso 1: credenciales originales
let found = USERS.find(u =>
  (u.email === id || u.fullName.toLowerCase() === id.toLowerCase()) && u.password === password
)
// Paso 2: nombre editado guardado
if (!found) {
  found = USERS.find(u => {
    const saved = getSavedProfile(u.email)
    return saved?.fullName?.toLowerCase() === id.toLowerCase() && u.password === password
  })
}
```

---

## 8. Toggle de visibilidad de contraseña

**¿Qué aporta?**
Icono de ojo en el campo de contraseña para alternar entre texto visible y oculto.

**Implementación:**
- `showPassword = ref(false)` controla `:type="showPassword ? 'text' : 'password'"`.
- Botón absolutamente posicionado dentro del contenedor `relative` del input.
- Dos iconos SVG inline (Heroicons): ojo abierto / ojo tachado, intercambiados con `v-if / v-else`.

---

## 9. Guards de Vue Router modernos (sin `next()`)

**¿Qué aporta?**
Elimina el warning de consola de Vue Router 4 sobre el uso del callback `next()` deprecado.

**Antes (estilo Vue Router 3):**
```typescript
function authGuard(_to, _from, next: NavigationGuardNext): void {
  if (!isAuthenticated()) next('/login')
  else next()
}
```

**Después (estilo Vue Router 4):**
```typescript
function authGuard(): string | undefined {
  if (!isAuthenticated()) return '/login'
}
```

---

*Generado el 10/05/2026 – Unit6 Proyecto Final completado.*
