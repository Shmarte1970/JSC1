// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface User {
  id:       string    // UUID generado en el login
  email:    string
  fullName: string
  phone:    string
  alias:    string
  active:   boolean
}

interface UserCredential {
  email:    string
  password: string
  fullName: string
}

// ─── Usuarios registrados ─────────────────────────────────────────────────────

export const USERS: UserCredential[] = [
  { email: 'admin@tasks.com',   password: 'admin123', fullName: 'Administrador Principal' },
  { email: 'usuario@tasks.com', password: 'user123',  fullName: 'Usuario Estándar'        },
  { email: 'editor@tasks.com',  password: 'edit123',  fullName: 'Editor de Contenidos'    },
]

const STORAGE_KEY        = 'taskapp_user'
const PROFILE_KEY_PREFIX = 'taskapp_profile_'  // clave por usuario: persiste entre sesiones

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

/** Lee el perfil guardado para un email concreto (persiste aunque se cierre sesión) */
function getSavedProfile(email: string): Pick<User, 'fullName' | 'phone' | 'alias'> | null {
  const raw = localStorage.getItem(PROFILE_KEY_PREFIX + email)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// ─── Funciones del servicio ───────────────────────────────────────────────────

/** Devuelve el usuario autenticado desde localStorage, o null si no hay sesión */
export function getUser(): User | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

/** Comprueba si hay una sesión activa */
export function isAuthenticated(): boolean {
  return getUser() !== null
}

/** Intenta iniciar sesión; acepta correo electrónico o nombre completo como identificador */
export function login(identifier: string, password: string): boolean {
  const id = identifier.trim().toLowerCase()

  // 1. Buscar por email exacto o por fullName original en USERS
  let found = USERS.find(
    u => (u.email === identifier.trim() || u.fullName.toLowerCase() === id) && u.password === password,
  )

  // 2. Si no coincide, buscar por el fullName editado y guardado en el perfil persistente
  if (!found) {
    found = USERS.find(u => {
      const saved = getSavedProfile(u.email)
      return saved?.fullName?.toLowerCase() === id && u.password === password
    })
  }

  if (!found) return false

  // Restaurar datos de perfil guardados previamente para este usuario
  const saved = getSavedProfile(found.email)

  const user: User = {
    id:       generateUUID(),
    email:    found.email,
    fullName: saved?.fullName ?? found.fullName,
    phone:    saved?.phone    ?? '',
    alias:    saved?.alias    ?? '',
    active:   true,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  return true
}

/** Cierra la sesión eliminando los datos de sesión (el perfil se conserva) */
export function logout(): void {
  localStorage.removeItem(STORAGE_KEY)
}

/** Actualiza los campos editables del perfil en sesión Y en la clave persistente del usuario */
export function updateUser(data: Pick<User, 'fullName' | 'phone' | 'alias'>): void {
  const user = getUser()
  if (!user) return
  const updated = { ...user, ...data }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  // Guardar también en clave persistente para que sobreviva al logout
  localStorage.setItem(
    PROFILE_KEY_PREFIX + user.email,
    JSON.stringify({ fullName: data.fullName, phone: data.phone, alias: data.alias }),
  )
}
