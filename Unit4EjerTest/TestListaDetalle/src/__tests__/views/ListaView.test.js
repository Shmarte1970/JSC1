import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../../App.vue'
import ListaView from '../../views/ListaView.vue'
import DetalleView from '../../views/DetalleView.vue'

function crearRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: ListaView },
      { path: '/alumno/:id', component: DetalleView },
    ],
  })
}

describe('ListaView', () => {

  it('debería mostrar la lista de estudiantes en la ruta raíz "/"', async () => {
    const router = crearRouter()
    const wrapper = mount(App, {
      global: { plugins: [router] },
    })
    await router.push('/')
    await router.isReady()

    expect(wrapper.findComponent(ListaView).exists()).toBe(true)
  })

  it('debería navegar al detalle del estudiante al hacer clic en un enlace', async () => {
    const router = crearRouter()
    const wrapper = mount(App, {
      global: { plugins: [router] },
    })
    await router.push('/')
    await router.isReady()

    // Clic en el primer enlace "Ver" de la tabla
    await wrapper.find('a[href^="/alumno/"]').trigger('click')
    await flushPromises()

    expect(wrapper.findComponent(DetalleView).exists()).toBe(true)
  })

})
