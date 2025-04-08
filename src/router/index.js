import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import ChoicesView from '@/views/auth/ChoicesView.vue'
import LearnersignupView from '@/views/auth/LearnersignupView.vue'
import LearnersignupForm from '@/components/auth/LearnersignupForm.vue'

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
      component: LearnersignupView
    },
    {
      path: '/choices',
      name: 'choices',
      component: ChoicesView
    }


  ],
})

export default router
