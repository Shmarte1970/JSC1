import api from './api'
import type {
  ShoppingList,
  CreateListPayload,
  UpdateListPayload,
  ListItem,
  AddItemPayload,
  UpdateItemPayload,
} from '@/types'

/** La API puede devolver `productId` en lugar de `id` */
function normalizeProduct(p: any) {
  return {
    id:          p?.id ?? p?.productId,
    name:        p?.name,
    unit:        p?.unit,
    description: p?.description,
    image:       p?.image,
  }
}

/** La API devuelve `shoppingListItemId` y quantity/price como strings */
function normalizeItem(i: any): ListItem {
  return {
    id:       i.id ?? i.itemId ?? i.shoppingListItemId,
    quantity: Number(i.quantity),
    price:    Number(i.price),
    product:  normalizeProduct(i.product ?? i),
  }
}

/** La API devuelve `shoppingListId` en lugar de `id` */
function normalizeList(l: any): ShoppingList {
  return {
    id:    l.id ?? l.listId ?? l.shoppingListId,
    title: l.title,
    date:  l.date,
    items: Array.isArray(l.items) ? l.items.map(normalizeItem) : [],
  }
}

export const listsService = {
  async getAll(search?: string): Promise<ShoppingList[]> {
    const params = search ? { name: search } : {}
    const { data } = await api.get<any[]>('/shopping-lists', { params })
    return data.map(normalizeList)
  },

  async getById(id: string): Promise<ShoppingList> {
    const { data } = await api.get<any>(`/shopping-lists/${id}`)
    return normalizeList(data)
  },

  async create(payload: CreateListPayload): Promise<ShoppingList> {
    const { data } = await api.post<any>('/shopping-lists', payload)
    return normalizeList(data)
  },

  async update(id: string, payload: UpdateListPayload): Promise<ShoppingList> {
    const { data } = await api.patch<any>(`/shopping-lists/${id}`, payload)
    return normalizeList(data)
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/shopping-lists/${id}`)
  },

  async addItem(listId: string, payload: AddItemPayload): Promise<ListItem> {
    const { data } = await api.post<any>(`/shopping-lists/${listId}/items`, payload)
    return normalizeItem(data)
  },

  async updateItem(listId: string, itemId: string, payload: UpdateItemPayload): Promise<ListItem> {
    const { data } = await api.patch<any>(`/shopping-lists/${listId}/items/${itemId}`, payload)
    return normalizeItem(data)
  },

  async removeItem(listId: string, itemId: string): Promise<void> {
    await api.delete(`/shopping-lists/${listId}/items/${itemId}`)
  },
}
