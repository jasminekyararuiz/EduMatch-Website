<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import LoginForm from '@/components/auth/LoginForm.vue'


import { useDisplay, useTheme } from 'vuetify'
import { computed } from 'vue'

const { Ismobile } = useDisplay()
const theme = useTheme()
const isDark = computed(() => theme.global.name.value === 'dark')

</script>

<template>
  <AppLayout>
    <template #content>

      <v-row :class="isDark ? 'bg-grey-darken-5 text-white' : 'bg-blue-lighten-5 text-black'" class="fill-height">

        <v-col cols="8" class="text-center d-none d-md-flex rounded-xl">
          <v-img class="mx-auto py-2 mb-3" src="/public/EduMatch-LogIn.jpg" width="10%" />
        </v-col>

        <v-col cols="4" class="mx-auto py-5">
          <v-card elevation="10" class="mx-auto" color="blue-lighten-5">
            <v-card-title class="py-4">
              <v-img class="mx-auto" src="/public/Edumatch_logo.png" width="25%" />
              <h3 class="text-center edu"><b>EduMatch</b></h3>
            </v-card-title>



            <v-card-text :class="isDark ? 'bg-grey-darken-4 text-white' : 'bg-surface-light text-black'">
              <LoginForm />

              <v-divider class="my-3" />


              <h5 class="text-center">
                Don't have account?
                <RouterLink class="text-primary" to="/registration">Click here to register</RouterLink>
              </h5>
             </v-card-text>
          </v-card>
        </v-col>

      </v-row>

    </template>
  </AppLayout>
</template>
<style scoped>

/* Style for the text overlay */
.text-overlay {
  position: absolute;
  top: 23%; /* Adjust this value to move the text vertically */
  left: 50%;
  transform: translate(-100%, -30%);
  z-index: 1;
}

.text-overlay h1 {
  font-size: 2.0rem;
  margin-bottom: 0.5rem;
  font-family: 'Times New Roman', Times, serif  ;
}

.text-overlay p {
  font-size: 1.2rem;
  color: rgb(19, 27, 35);
}

.image-container {
  position: relative;
  z-index: 0;
}

.edu {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

}
</style>
