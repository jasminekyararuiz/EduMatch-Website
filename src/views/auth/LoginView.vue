<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>

<template>
  <AppLayout>
    <template #content >

       <v-row  class="bg-blue-lighten-5 " >
        <v-col cols="8" class="text-center d-none d-md-flex rounded-xl">
          <v-img class="mx-auto py-5 mb-3" src="/public/EduMatch-LogIn.jpg" width="10%">

          </v-img>


        </v-col>
        <br>
        <v-col cols="4" class="mx-auto py-5 " > <br>
          <v-card class="mx-auto rounded-lg" >
            <v-card-title class="py-4 ">
              <v-img class="mx-auto" src="/public/Edumatch_logo.png" width="25%"> </v-img>
              <h3 class="text-center"><b>EduMatch</b></h3>
            </v-card-title>

            <v-card-text class="bg-surface-light pt-4">
              <LoginForm></LoginForm>

              <v-divider class="my-3"></v-divider>
              <h5 class="text-center">
                Don't have account?
                <RouterLink class="text-primary" to="/registration">Click here to register </RouterLink>
              </h5>
            </v-card-text>
          </v-card>

        </v-col>
      </v-row>

    </template>

  </AppLayout>
</template>

<style scoped>


</style>
