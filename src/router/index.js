import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegistrationView from '@/views/auth/RegistrationView.vue'
import LandingPage from '@/views/system/LandingPage.vue'
import HowItWorks from '@/views/system/HowItWorks.vue'
import TutorApplication from '@/views/system/TutorApplication.vue'

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
      name: 'landing-page',
      component: LandingPage
    },
    {
      path: '/howitworks',
      name: 'how-it-works',
      component: HowItWorks
    },
    {
      path: '/tutorapplication',
      name: 'tutor-application',
      component: TutorApplication
    },


  ],
})

export default router
