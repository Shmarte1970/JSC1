import { describe, it, expect, vi } from 'vitest'
import { getUsers } from '../../services/userService.js'

// ─────────────────────────────────────────────────────────
// Los tests nunca llaman a la API real.
// Usamos vi.stubGlobal('fetch', ...) para sustituir fetch
// por una función falsa que devuelve los datos que nosotros
// controlamos.  Con unstubGlobals: true en vitest.config.js
// el stub se elimina automáticamente tras cada test.
// ─────────────────────────────────────────────────────────

describe('userService', () => {

  it('debería devolver la lista de usuarios cuando la respuesta es correcta', async () => {
    // Datos que el servidor "devolvería"
    const usuariosMock = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]

    // Simulamos fetch devolviendo ok: true y los datos mock
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(usuariosMock),
    }))

    const resultado = await getUsers()

    expect(resultado).toEqual(usuariosMock)
  })

  it('debería lanzar un error cuando la respuesta del servidor falla', async () => {
    // Simulamos fetch devolviendo ok: false (ej. error 500)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }))

    await expect(getUsers()).rejects.toThrow('Error al obtener los usuarios del servidor')
  })

})
