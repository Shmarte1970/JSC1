const API_URL = 'https://jsonplaceholder.typicode.com/users'

/**
 * Recupera la lista de usuarios del servidor.
 * Devuelve un array de objetos { id, name }.
 * Lanza un Error si la respuesta del servidor no es correcta.
 */
export async function getUsers() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Error al obtener los usuarios del servidor')
  }

  return response.json()
}
