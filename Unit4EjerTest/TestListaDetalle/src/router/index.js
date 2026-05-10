import { createRouter, createWebHistory } from 'vue-router'
import ListaView from '../views/ListaView.vue'
import DetalleView from '../views/DetalleView.vue'

const routes = [
  { path: '/', component: ListaView },
  { path: '/alumno/:id', component: DetalleView }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
