import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../services/auth'
import LoginView   from '../views/LoginView.vue'
import TasksView   from '../views/TasksView.vue'
import ProfilePage from '../views/ProfilePage.vue'

// ─── Guards ───────────────────────────────────────────────────────────────────

/** Protege rutas que requieren autenticación → redirige a /login si no hay sesión */
function authGuard(): string | undefined {
  if (!isAuthenticated()) return '/login'
}

/** Evita que un usuario ya autenticado acceda al login → redirige a /tasks */
function guestGuard(): string | undefined {
  if (isAuthenticated()) return '/tasks'
}

// ─── Rutas ────────────────────────────────────────────────────────────────────

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/tasks',
    },
    {
      path: '/login',
      component: LoginView,
      beforeEnter: guestGuard,
    },
    {
      path: '/tasks',
      component: TasksView,
      beforeEnter: authGuard,
    },
    {
      // Ejercicio 1: ruta /profile protegida por guard de autenticación
      path: '/profile',
      component: ProfilePage,
      beforeEnter: authGuard,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
