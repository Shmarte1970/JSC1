import { createRouter, createWebHistory } from 'vue-router'
import { roleGuard } from '../services/auth'
import GuestView    from '../views/GuestView.vue'
import EditorPanel  from '../views/EditorPanel.vue'
import AdminConfig  from '../views/AdminConfig.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: GuestView,
    },
    {
      path: '/admin/editor',
      component: EditorPanel,
      beforeEnter: roleGuard(['Editor', 'Admin']),
    },
    {
      path: '/admin/config',
      component: AdminConfig,
      beforeEnter: roleGuard(['Admin']),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
