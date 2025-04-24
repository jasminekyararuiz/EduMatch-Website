<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import RegistrationForm from '@/components/auth/RegistrationForm.vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>

<template>
  
  <AppLayout>
    <template #content>
      
      <v-row :color="theme === 'light' ? 'blue-lighten-5' : 'blue-lighten-5'" :class="theme === 'light' ? 'text-black' : 'text-white'">
        <v-col cols="12" md="6" class="mx-auto">
          <v-card elevation="10" class="mx-auto" color="blue-lighten-5">
            <v-card-title>
              <v-img class="mx-auto" src="/public/Edumatch_logo.png" width="25%"> </v-img>
              <h3 class="text-center edu"><b>EduMatch</b></h3>
            </v-card-title>

            <v-card-text class="bg-surface-light pt-4">
           <RegistrationForm> </RegistrationForm>

              <v-divider class="my-3"></v-divider>
              <h5 class="text-center">
                Already have an account? <RouterLink class="text-primary" to="/">Login</RouterLink>
              </h5>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>

<style scoped>
.edu {
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
}
</style>