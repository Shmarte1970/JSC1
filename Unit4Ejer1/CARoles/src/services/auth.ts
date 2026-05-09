import { reactive } from 'vue'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

// ── Tipos ────────────────────────────────────────────────────────────────────

export interface UserState {
  isAuthenticated: boolean
  role: 'Guest' | 'Editor' | 'Admin'
  nombre: string
}

interface UserCredential {
  nombre: string
  password: string
  role: 'Guest' | 'Editor' | 'Admin'
}

// ── Base de usuarios simulada ────────────────────────────────────────────────

export const USERS: UserCredential[] = [
  { nombre: 'Admin',                    password: 'Admin', role: 'Admin'  },
  { nombre: 'Armando Bronca Segura',    password: '1234',  role: 'Guest'  },
  { nombre: 'Dolores Fuertes de Barriga', password: '1234', role: 'Guest' },
  { nombre: 'Margarita Flores del Campo', password: '1234', role: 'Guest' },
  { nombre: 'Elba Lazo',               password: '1234',  role: 'Guest'  },
  { nombre: 'Elsa Capuntas',           password: '1234',  role: 'Editor' },
]

// ── Estado reactivo global ───────────────────────────────────────────────────

export const currentUser = reactive<UserState>({
  isAuthenticated: false,
  role: 'Guest',
  nombre: '',
})

// ── Funciones del servicio ───────────────────────────────────────────────────

export function getCurrentUser(): UserState {
  return currentUser
}

export function login(nombre: string, password: string): boolean {
  const found = USERS.find(u => u.nombre === nombre && u.password === password)
  if (found) {
    currentUser.isAuthenticated = true
    currentUser.role             = found.role
    currentUser.nombre           = found.nombre
    console.log('[Auth] Sesión iniciada →', { ...currentUser })
    return true
  }
  console.warn('[Auth] Credenciales incorrectas para:', nombre)
  return false
}

export function logout(): void {
  console.log('[Auth] Sesión cerrada — usuario anterior:', currentUser.nombre)
  currentUser.isAuthenticated = false
  currentUser.role             = 'Guest'
  currentUser.nombre           = ''
  console.log('[Auth] Estado actual →', { ...currentUser })
}

// ── Guard de roles ───────────────────────────────────────────────────────────

export function roleGuard(allowedRoles: Array<'Guest' | 'Editor' | 'Admin'>) {
  return (
    _to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): void => {
    const user = getCurrentUser()

    if (!user.isAuthenticated || !allowedRoles.includes(user.role)) {
      console.log(
        `[roleGuard] Acceso denegado a "${_to.path}". ` +
        `Rol requerido: [${allowedRoles.join(', ')}]. ` +
        `Rol actual: "${user.isAuthenticated ? user.role : 'no autenticado'}".`
      )
      next('/')
    } else {
      next()
    }
  }
}
