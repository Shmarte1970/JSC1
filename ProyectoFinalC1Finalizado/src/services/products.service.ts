import api from './api'
import type { Product, Unit, CreateProductPayload, UpdateProductPayload } from '@/types'

/** La API puede devolver `productId` en lugar de `id` — normalizamos aquí */
function normalizeProduct(p: any): Product {
  return {
    id:          p.id          ?? p.productId,
    name:        p.name,
    unit:        p.unit,
    description: p.description,
    image:       p.image,
  }
}

export const productsService = {
  async getAll(search?: string): Promise<Product[]> {
    const params = search ? { name: search } : {}
    const { data } = await api.get<any[]>('/products', { params })
    return data.map(normalizeProduct)
  },

  async getById(id: string): Promise<Product> {
    const { data } = await api.get<any>(`/products/${id}`)
    return normalizeProduct(data)
  },

  async create(payload: CreateProductPayload): Promise<Product> {
    const { data } = await api.post<any>('/products', payload)
    return normalizeProduct(data)
  },

  async update(id: string, payload: UpdateProductPayload): Promise<Product> {
    const { data } = await api.patch<any>(`/products/${id}`, payload)
    return normalizeProduct(data)
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/products/${id}`)
  },

  async getUnits(): Promise<Unit[]> {
    const { data } = await api.get<any[]>('/products/units')
    // API may return plain strings ["kg","g",...] or objects [{id,name}]
    return data.map((u: any) =>
      typeof u === 'string' ? { id: u, name: u } : u,
    )
  },
}
