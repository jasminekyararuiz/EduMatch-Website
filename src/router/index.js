import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegistrationView from '@/views/auth/RegistrationView.vue'
import LandingPage from '@/views/system/LandingPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginView,
    },
    {
      path: '/registration',
      name: 'registrationsignup',
      component: RegistrationView,
    },
    {
      path: '/landingpage',
      name: 'landingpage',
      component: LandingPage,
    },
  ],
})

export default router
