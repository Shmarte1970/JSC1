import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'

// Helper para seleccionar una figura clicando su botón
async function clickFigura(wrapper, label) {
  const button = wrapper.findAll('button').find(b => b.text() === label)
  await button.trigger('click')
}

describe('Calculadora de Áreas', () => {

  // ===== CUADRADO =====
  it('debe mostrar un input cuando se selecciona Cuadrado', () => {
    const wrapper = mount(App)
    // Cuadrado es la figura por defecto al montar el componente
    expect(wrapper.findAll('input')).toHaveLength(1)
  })

  it('debe calcular correctamente el área del Cuadrado', async () => {
    const wrapper = mount(App)
    await wrapper.find('input').setValue(5)
    expect(wrapper.find('.area-valor').text()).toBe('25.00')
  })

  it('debe mostrar la fórmula correcta del Cuadrado', async () => {
    const wrapper = mount(App)
    await wrapper.find('input').setValue(5)
    expect(wrapper.find('.formula').text()).toBe('Área = l² = 5 × 5')
  })

  // ===== RECTÁNGULO =====
  it('debe mostrar dos inputs cuando se selecciona Rectángulo', async () => {
    const wrapper = mount(App)
    await clickFigura(wrapper, 'Rectángulo')
    expect(wrapper.findAll('input')).toHaveLength(2)
  })

  it('debe calcular correctamente el área del Rectángulo', async () => {
    const wrapper = mount(App)
    await clickFigura(wrapper, 'Rectángulo')
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue(4) // base
    await inputs[1].setValue(6) // altura
    expect(wrapper.find('.area-valor').text()).toBe('24.00')
  })

  it('debe mostrar la fórmula correcta del Rectángulo', async () => {
    const wrapper = mount(App)
    await clickFigura(wrapper, 'Rectángulo')
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue(4)
    await inputs[1].setValue(6)
    expect(wrapper.find('.formula').text()).toBe('Área = b × h = 4 × 6')
  })

  // ===== CÍRCULO =====
  it('debe mostrar un input cuando se selecciona Círculo', async () => {
    const wrapper = mount(App)
    await clickFigura(wrapper, 'Círculo')
    expect(wrapper.findAll('input')).toHaveLength(1)
  })

  it('debe calcular correctamente el área del Círculo', async () => {
    const wrapper = mount(App)
    await clickFigura(wrapper, 'Círculo')
    await wrapper.find('input').setValue(3)
    const expected = (Math.PI * 3 * 3).toFixed(2)
    expect(wrapper.find('.area-valor').text()).toBe(expected)
  })

  it('debe mostrar la fórmula correcta del Círculo', async () => {
    const wrapper = mount(App)
    await clickFigura(wrapper, 'Círculo')
    await wrapper.find('input').setValue(3)
    expect(wrapper.find('.formula').text()).toBe('Área = π × r² = π × 3²')
  })

  // ===== TRIÁNGULO =====
  it('debe mostrar dos inputs cuando se selecciona Triángulo', async () => {
    const wrapper = mount(App)
    await clickFigura(wrapper, 'Triángulo')
    expect(wrapper.findAll('input')).toHaveLength(2)
  })

  it('debe calcular correctamente el área del Triángulo', async () => {
    const wrapper = mount(App)
    await clickFigura(wrapper, 'Triángulo')
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue(8) // base
    await inputs[1].setValue(5) // altura
    expect(wrapper.find('.area-valor').text()).toBe('20.00')
  })

  it('debe mostrar la fórmula correcta del Triángulo', async () => {
    const wrapper = mount(App)
    await clickFigura(wrapper, 'Triángulo')
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue(8)
    await inputs[1].setValue(5)
    expect(wrapper.find('.formula').text()).toBe('Área = (b × h) / 2 = (8 × 5) / 2')
  })

})
