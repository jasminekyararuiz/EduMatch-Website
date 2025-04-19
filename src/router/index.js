import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegistrationView from '@/views/auth/RegistrationView.vue'
import LandingPage from '@/views/system/LandingPage.vue'
import HowItWorks from '@/views/system/HowItWorks.vue'
<<<<<<< HEAD
import TutorApplication from '@/views/system/TutorApplication.vue'
=======
import FindTutorView from '@/views/system/FindTutorView.vue'
>>>>>>> 13fbef21c12a4d3cb04a9aa594d598a0e7630267

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
<<<<<<< HEAD
      name: 'landing-page',
      component: LandingPage
=======
      name: 'landingpage',
      component: LandingPage,
>>>>>>> 13fbef21c12a4d3cb04a9aa594d598a0e7630267
    },
<<<<<<< HEAD
=======
    {
      path: '/howitworks',
      name: 'how-it-works',
      component: HowItWorks
    },
    {
<<<<<<< HEAD
      path: '/tutorapplication',
      name: 'tutor-application',
      component: TutorApplication
=======
      path: '/findtutor',
      name: 'findtutor',
      component: FindTutorView
>>>>>>> 13fbef21c12a4d3cb04a9aa594d598a0e7630267
    },


>>>>>>> 31ec340bba7cfeb3ef0bdc3cfc63d4ad82bd4192
  ],
})

export default router
