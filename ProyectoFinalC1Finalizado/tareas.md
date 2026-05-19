# Proyecto Final C1 — Lista de la Compra

> Vue 3 + Vite + TypeScript + Tailwind CSS | API: http://edp.techlab.uoc.edu:8080

---

## Estructura de directorios

```
ProyectoFinalC1/
├── frontend/               ← Vue 3 + Vite + TypeScript + Tailwind
│   ├── src/
│   │   ├── assets/img/     ← SVGs del B1 (30 productos)
│   │   ├── components/
│   │   ├── views/
│   │   ├── services/
│   │   ├── router/
│   │   └── data/
│   │       ├── clientes.json   ← 10 primeros de alumnos.json adaptados
│   │       └── productos.json  ← 30 productos del B1 con imagen y categoría
│   ├── .env
│   └── ...
└── tareas.md
```

---

## Fase 1 — Scaffolding y configuración

- [x] Leer PDF del proyecto y analizar requisitos
- [x] Revisar proyectos de referencia (B1, vue.md)
- [x] Confirmar uso de API externa UOC (http://edp.techlab.uoc.edu:8080)
- [x] Crear tareas.md
- [x] Scaffolding frontend: `npm create vue@latest` (Vue3 + TS + Router)
- [x] Instalar Tailwind CSS en frontend
- [x] Configurar `.env` (VITE_API_URL, VITE_APP_NAME)
- [x] Copiar SVGs del B1 → `frontend/src/assets/img/`
- [x] Crear `frontend/src/data/clientes.json` (10 usuarios de alumnos.json adaptados)
- [x] Crear `frontend/src/data/productos.json` (30 productos del B1)
- [x] Tailwind: paleta pastel gris-light en `tailwind.config.js`

---

## Fase 2 — Servicios y Router

- [x] Configurar Vue Router con rutas públicas y protegidas
- [x] Guard de autenticación (`authGuard`) — comprueba JWT en localStorage
- [x] Servicio HTTP (`api.ts`) — Axios con interceptor de token JWT
- [x] Servicio auth (`auth.service.ts`) — login, register, logout, perfil
- [x] Servicio productos (`products.service.ts`) — CRUD + búsqueda + units
- [x] Servicio listas (`lists.service.ts`) — CRUD + gestión de ítems

---

## Fase 3 — Componentes reutilizables

- [x] `AppMessage.vue` — notificaciones éxito/error/info (reutilizable)
- [x] `AppHeader.vue` — cabecera con logo, nombre usuario, logout
- [x] `ConfirmDialog.vue` — modal de confirmación genérico
- [x] `ProductCard.vue` — tarjeta de producto con imagen SVG
- [x] `ProductListItem.vue` — ítem de producto en vista lista compacta

---

## Fase 4 — Vistas

- [x] `LandingView.vue` — página pública de presentación
- [x] `LoginView.vue` — formulario login + usuarios de prueba visibles
- [x] `RegisterView.vue` — formulario registro (vee-validate + Yup)
- [x] `ProfileView.vue` — ver/editar perfil, restablecer datos, cargar seed
- [x] `ProductsView.vue` — catálogo CRUD, búsqueda, toggle tarjeta/lista
- [x] `ProductEditView.vue` — edición/eliminación de un producto
- [x] `ListsView.vue` — listado de listas con búsqueda y crear nueva
- [x] `ListDetailView.vue` — detalle lista, añadir/quitar productos, totales
- [x] `NotFoundView.vue` — página 404

---

## Fase 5 — Integración y pulido final

- [ ] Pruebas manuales flujo completo (registro → login → productos → listas)
- [ ] Manejo de errores de red (token expirado, 401, 404, 500)
- [ ] Responsive mobile (Tailwind breakpoints sm/md/lg)
- [ ] Revisión accesibilidad básica (aria-labels, contraste)
- [ ] Animaciones de transición entre vistas (Vue `<Transition>`)

---

## Usuarios de prueba (clientes.json — primeros 10 de alumnos.json)

| # | Nombre | Email | Password |
|---|--------|-------|----------|
| 1 | Armando Bronca Segura | armando.bronca@uoc.edu | Arm@nd01234 |
| 2 | Dolores Fuertes de Barriga | dolores.fuertes@uoc.edu | D0l0r@s1234 |
| 3 | Margarita Flores del Campo | margarita.flores@uoc.edu | M@rgar1t4 |
| 4 | Elba Lazo | elba.lazo@uoc.edu | Elb@L@z01234 |
| 5 | Elsa Capuntas | elsa.capuntas@uoc.edu | Els@C@p1234 |
| 6 | Luz Cuesta Mogollón | luz.cuesta@uoc.edu | LuzCu@st@1234 |
| 7 | Alma Rota | alma.rota@uoc.edu | Alm@R0t@1234 |
| 8 | Consuelo Terán | consuelo.teran@uoc.edu | C0nsu@l01234 |
| 9 | Rosa Melano | rosa.melano@uoc.edu | R0s@M3l1234 |
| 10 | Ana Busado | ana.busado@uoc.edu | An@Bus@d01234 |

---

## Notas de diseño

- Paleta base: grises light pastel (`gray-50`, `gray-100`, `gray-200`)
- Acento primario: verde sage pastel (`#a8c5a0`) para botones y highlights
- Acento secundario: azul lavanda suave (`#b8c5e0`) para info/enlaces
- Tipografía: Inter (Google Fonts) o system-ui como fallback
- Imágenes: SVGs propios del B1 (30 productos en 5 categorías)
- Toggle vista productos: tarjetas con imagen SVG / lista compacta
