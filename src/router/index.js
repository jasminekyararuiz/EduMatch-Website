import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import ChoicesView from '@/views/auth/ChoicesView.vue'
import LearnersignupForm from '@/components/auth/LearnersignupForm.vue'
import RegistrationView from '@/views/auth/RegistrationView.vue'

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
      path: '/choices',
      name: 'choices',
      component: ChoicesView
    }


  ],
})

export default router
