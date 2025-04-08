import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import ChoicesView from '@/views/auth/ChoicesView.vue'
import LearnersignupView from '@/views/auth/LearnersignupView.vue'
<<<<<<< HEAD
import LearnersignupForm from '@/components/auth/LearnersignupForm.vue'
=======
>>>>>>> 7d2ac030da2b46f89fdedd16fb1dcec8dafd26a9

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginView
    },
    {
      path: '/learnersignup',
      name: 'learnersignup',
<<<<<<< HEAD
      component: LearnersignupForm
=======
      component: LearnersignupView
>>>>>>> 7d2ac030da2b46f89fdedd16fb1dcec8dafd26a9
    },
    {
      path: '/choices',
      name: 'choices',
      component: ChoicesView
    }

<<<<<<< HEAD
=======

>>>>>>> 7d2ac030da2b46f89fdedd16fb1dcec8dafd26a9
  ],
})

export default router
