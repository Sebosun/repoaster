import { createRouter, createWebHistory } from 'vue-router'
import ViewHome from '@/views/ViewHome.vue'
import ViewRepoast from '@/views/ViewRepoast.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ViewHome
    },
    {
      path: '/repoast',
      name: 'repoast',
      component: ViewRepoast
    }
  ]
})

export default router
