import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegistrationView from '@/views/auth/RegistrationView.vue'
import LandingPage from '@/views/system/LandingPage.vue'
import HowItWorks from '@/views/system/HowItWorks.vue'
import TutorApplication from '@/views/system/TutorApplication.vue'
import FindTutorView from '@/views/system/FindTutorView.vue'
import FindTutor from '@/views/system/FindTutor.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: RegistrationView,
    },
    {
      path: '/',
      name: 'landingpage',
      component: LandingPage,
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
    {
      path: '/findtutor',
      name: 'findtutor',
      component: FindTutorView
    },
    {
      path: '/findtutornow',
      name: 'findtutornow',
      component: FindTutor
    }
  ],
})

export default router
