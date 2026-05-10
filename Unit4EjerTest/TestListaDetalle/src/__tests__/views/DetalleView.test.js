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

describe('DetalleView', () => {

  it('debería mostrar el detalle del estudiante en la ruta "/alumno/:id"', async () => {
    const router = crearRouter()
    const wrapper = mount(App, {
      global: { plugins: [router] },
    })
    await router.push('/alumno/1')
    await router.isReady()

    expect(wrapper.findComponent(DetalleView).exists()).toBe(true)
    // El alumno con id 1 es "Armando Bronca Segura"
    expect(wrapper.text()).toContain('Armando Bronca Segura')
  })

  it('debería navegar de vuelta a la lista al hacer clic en "Volver al listado"', async () => {
    const router = crearRouter()
    const wrapper = mount(App, {
      global: { plugins: [router] },
    })
    await router.push('/alumno/1')
    await router.isReady()

    // Clic en el primer enlace "Volver al listado"
    await wrapper.find('a[href="/"]').trigger('click')
    await flushPromises()

    expect(wrapper.findComponent(ListaView).exists()).toBe(true)
  })

})
