import { createRouter, createWebHistory } from 'vue-router'
import SearchView from '../views/SearchView.vue'
import ResultsView from '../views/ResultsView.vue'

// SIN props: true — los query params se leen con useRoute() en cada componente
const routes = [
  { path: '/search',         component: SearchView  },
  { path: '/search/results', component: ResultsView },
  { path: '/:pathMatch(.*)*', redirect: '/search'   }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
