import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegistrationView from '@/views/auth/RegistrationView.vue'
import LandingPage from '@/views/system/LandingPage.vue'
import HowItWorks from '@/views/system/HowItWorks.vue'
import TutorApplication from '@/views/system/TutorApplication.vue'
import FindTutorView from '@/views/system/FindTutorView.vue'
import FindTutor from '@/views/system/FindTutor.vue'
import ForbiddenView from '@/views/errors/ForbiddenView.vue'
import NotFoundView from '@/views/errors/NotFoundView.vue'
import { useAuthUserStore } from '@/stores/authUser'


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
      component: TutorApplication,
      meta: { requiresAuth: true },
    },
    {
      path: '/findtutor',
      name: 'findtutor',
      component: FindTutorView,
      meta: { requiresAuth: true },
    },
    {
      path: '/findtutorhere',
      name: 'find-tutor-here',
      component: FindTutor
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: ForbiddenView
    },
    {
      path: '/notfound',
      name: 'notfound',
      component: NotFoundView
    },

  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthUserStore()
  const isLoggedIn = authStore.isAuthenticated
  const userRole = authStore.user?.role  // Get role from the store

  // Block login/signup if user is logged in
  if (isLoggedIn && (to.name === 'login' || to.name === 'signup')) {
    // Redirect users based on their role
    if (userRole === 'learner') {
      return { name: 'findtutor' }
    } else if (userRole === 'tutor') {
      return { name: 'tutor-application' }
    }
    return { name: 'landingpage' }  // Fallback route
  }

  // Check if route exists
  if (!to.name) {
    return { name: 'notfound' }
  }


  // Redirect to login if trying to access protected routes without being logged in
  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login' }
  }

  // Prevent users from searching or manually navigating to login/signup if they are logged in
  if (isLoggedIn && (to.name === 'login' || to.name === 'signup')) {
    return { name: 'landingpage' } // or redirect to another route based on role
  }

})


export default router
