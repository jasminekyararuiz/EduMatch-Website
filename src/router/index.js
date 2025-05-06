import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegistrationView from '@/views/auth/RegistrationView.vue'
import LandingPage from '@/views/system/LandingPage.vue'
import TutorApplication from '@/views/system/TutorApplication.vue'
import FindTutorView from '@/views/system/FindTutorView.vue'
import { useAuthUserStore } from '@/stores/authUser'
import TutorDashboard from '@/views/system/TutorDashboard.vue'
import LearnerDashboard from '@/views/system/LearnerDashboard.vue'


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
      path: '/tutordashboard',
      name: 'tutor-dashboard',
      component: TutorDashboard
    },
    {
      path: '/learnerdashboard',
      name: 'learner-dashboard',
      component: LearnerDashboard
    },


  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthUserStore()
  const isLoggedIn = authStore.isAuthenticated
  const userRole = authStore.user?.role || authStore.userRole // Adjust based on your store state


  // Check if route exists
  if (!to.name) {
    return { name: 'notfound' }
  }

  // Prevent navigation to login or signup pages if the user is logged in (unless admin)
  if (isLoggedIn && (to.name === 'login' || to.name === 'signup')) {
    if (userRole === 'admin') {
      return true  // Allow admin to access login or signup (if needed for some reason)
    }
    // Redirect non-admin users to the appropriate dashboard or landing page
    if (userRole === 'learner') {
      return { name: '/findtutor' }
    } else if (userRole === 'tutor') {
      return { name: '/tutor-application' }
    }
    return { name: 'landingpage' }
  }



})


export default router
