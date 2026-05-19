// ── Auth ──────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
}

// ── User ──────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  email: string
}

export interface UpdateProfilePayload {
  name?: string
  email?: string
  password?: string
}

// ── Product ───────────────────────────────────────────────────────────────────

export interface Unit {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
  description?: string
  unit: string
  image?: string
}

export interface CreateProductPayload {
  name: string
  description?: string
  unit: string
}

export interface UpdateProductPayload extends CreateProductPayload {}

// ── Shopping List ─────────────────────────────────────────────────────────────

export interface ListItem {
  id: string
  product: Product
  quantity: number
  price: number
}

export interface ShoppingList {
  id: string
  title: string
  date: string
  items: ListItem[]
}

export interface CreateListPayload {
  title: string
  date: string   // ISO 8601: YYYY-MM-DD
}

export interface UpdateListPayload {
  title?: string
  date?: string
}

export interface AddItemPayload {
  productId: string
  quantity: number
  price: number
}

export interface UpdateItemPayload {
  quantity: number
  price: number
}

// ── API generic ───────────────────────────────────────────────────────────────

export interface ApiError {
  message: string
  statusCode?: number
}
