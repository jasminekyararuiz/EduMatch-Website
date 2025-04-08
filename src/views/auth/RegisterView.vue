<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row>
        <v-col cols="12" md="6" class="mx-auto">
          <v-card class="mx-auto">
            <v-card-title>
              <v-img class="mx-auto" src="/public/Edumatch_logo.png" width="25%"> </v-img>
              <h3 class="text-center"><b>EduMatch</b></h3>
            </v-card-title>

            <v-card-text class="bg-surface-light pt-4">
              <RegisterForm></RegisterForm>

              <v-divider class="my-3"></v-divider>
              <h5 class="text-center">
                Already have an acoount? <RouterLink class="text-primary" to="/">LogIn</RouterLink>
              </h5>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
