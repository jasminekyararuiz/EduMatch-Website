import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegistrationView from '@/views/auth/RegistrationView.vue'
import LandingPage from '@/views/system/LandingPage.vue'
import HowItWorks from '@/views/system/HowItWorks.vue'
import TutorApplication from '@/views/system/TutorApplication.vue'
import FindTutorView from '@/views/system/FindTutorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
<<<<<<< HEAD
      path: '/',
      name: 'home',
      component:LandingPage,
=======
      path: '/login',
      name: 'login',
      component: LoginView,
>>>>>>> 6ead8cf71b88bf36b5b05ed5ccef4f5de930bcd1
    },
    {
      path: '/signup',
      name: 'signup',
      component: RegistrationView,
    },
    {
<<<<<<< HEAD
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
         path: '/howitworks',
         name: 'howitworks',
       component: HowItWorks
    },
=======
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
>>>>>>> 6ead8cf71b88bf36b5b05ed5ccef4f5de930bcd1
  ],
})

export default router
