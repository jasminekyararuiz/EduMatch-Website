import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegistrationView from '@/views/auth/RegistrationView.vue'
import LandingPage from '@/views/system/LandingPage.vue'
import HowItWorks from '@/views/system/HowItWorks.vue'
import FindTutorView from '@/views/system/FindTutorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginView
    },
    {
      path: '/registration',
      name: 'registrationsignup',
      component: RegistrationView
    },
    {
      path: '/landingpage',
      name: 'landingpage',
      component: LandingPage
    },
    {
      path: '/howitworks',
      name: 'howitworks',
      component: HowItWorks
    },
    {
      path: '/findtutor',
      name: 'findtutor',
      component: FindTutorView
    },


  ],
})

export default router
