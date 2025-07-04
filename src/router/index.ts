import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/auth/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPassword.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/DashboardView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/error/NotFound.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  await authStore.getAuth()

  console.log(authStore.isLoggedIn)
  if (to.path === '/' && authStore.isLoggedIn) {
    next('/dashboard')
  } else if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
