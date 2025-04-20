<script setup>
import { ref } from 'vue'

const theme = ref('light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>
<template>
  <v-responsive>
    <v-app :theme="theme">
  <v-main>
    <v-container class="py-5 mb-3">
      <slot name="content"> </slot>
    </v-container>
  </v-main>

      <v-footer :color="theme === 'light' ? 'grey-lighten-4' : 'grey-darken-4'" :class="theme === 'light' ? 'text-black' : 'text-white'">

  <v-container fluid>
    <v-row align="center" justify="space-between">
      <!-- Left side: Logo and Tagline -->
      <v-col cols="12" md="4" class="d-flex flex-column align-center">
        <v-img class="mx-auto mb-2 mt-5 px-5" src="/public/Edumatch_logo.png" width="30%"> </v-img>
        <span class="text-h3 font-weight-bold footer">
      <span class="text-blue-lighten-2"><b>Edu</b></span>
      <span class="text-blue-darken-4"><b>Match</b></span>
      </span>
        <p class="text-subtitle-2 text-grey-darken-1"><i>Turn Knowledge Into Opportunity</i></p>
      </v-col>

      <!-- Right side: Social Media -->
      <v-col cols="12" md="8">
        <div class="text-center mb-4">
          <h4 class="text-subtitle-1 font-weight-bold">CONNECT MORE WITH US</h4>
        </div>
        <v-row dense>
          <!-- Jasmine -->
          <v-col cols="12" sm="4" class="mb-4">
            <h5 class="text-body-2 font-weight-medium mb-2"><b>Jasmine Kyara Ruiz</b></h5>
            <div class="d-flex align-center mb-1 text-caption">
              <v-icon color="blue" size="18" class="me-2">mdi-facebook</v-icon> Jasmine Kyara Ruiz
            </div>
            <div class="d-flex align-center mb-1 text-caption">
              <v-icon color="blue" size="18" class="me-2">mdi-instagram</v-icon> @offline_kyr
            </div>
            <div class="d-flex align-center mb-1 text-caption">
              <v-icon color="blue" size="18" class="me-2">mdi-twitter</v-icon> @jazzzzmine24
            </div>
            <div class="d-flex align-center mb-1 text-caption">
              <v-icon color="blue" size="18" class="me-2">mdi-gmail</v-icon> jasminekyararuiz24@gmail.com
            </div>
            <div class="d-flex align-center text-caption">
              <v-icon color="blue" size="18" class="me-2">mdi-linkedin</v-icon> Jasmine Kyara Ruiz
            </div>
          </v-col>

          <!-- Leanheit -->
          <v-col cols="12" sm="4" class="mb-4">
            <h5 class="text-body-2 font-weight-medium mb-2"><b>Leanheit May Miñoza</b></h5>
            <div class="d-flex align-center mb-1 text-caption">
              <v-icon color="blue" size="18" class="me-2">mdi-facebook</v-icon> Leanheit May Miñoza
            </div>
            <div class="d-flex align-center mb-1 text-caption">
              <v-icon color="blue" size="18" class="me-2">mdi-instagram</v-icon> lnheitmy
            </div>
            <div class="d-flex align-center mb-1 text-caption">
              <v-icon color="blue" size="18" class="me-2">mdi-twitter</v-icon> lenit
            </div>
            <div class="d-flex align-center mb-1 text-caption">
              <v-icon color="blue" size="18" class="me-2">mdi-gmail</v-icon> leanheitmay@gmail.com
            </div>
            <div class="d-flex align-center text-caption">
              <v-icon color="blue" size="18" class="me-2">mdi-linkedin</v-icon> Leanheit May Miñoza
            </div>
          </v-col>

          <!-- Cristina -->
          <v-col cols="12" sm="4" class="mb-4">
            <h5 class="text-body-2 font-weight-medium mb-2"><b>Cristina Berwan</b></h5>
            <div class="d-flex align-center mb-1 text-caption">
              <v-icon color="blue" size="18" class="me-2">mdi-facebook</v-icon> cristina
            </div>
            <div class="d-flex align-center mb-1 text-caption">
              <v-icon color="blue" size="18" class="me-2">mdi-instagram</v-icon> @shas.shee
            </div>
            <div class="d-flex align-center mb-1 text-caption">
              <v-icon color="blue" size="18" class="me-2">mdi-twitter</v-icon> @cristinaberwan
            </div>
            <div class="d-flex align-center mb-1 text-caption">
              <v-icon color="blue" size="18" class="me-2">mdi-gmail</v-icon> cristinaberwan@gmail.com
            </div>
            <div class="d-flex align-center text-caption">
              <v-icon color="blue" size="18" class="me-2">mdi-linkedin</v-icon> Cristina Berwan
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Divider & Copyright -->
    <v-divider class="my-6"></v-divider>
    <v-row justify="center">
      <span class="text-caption text-grey-darken-1">© 2025 EduMatch — All Rights Reserved.</span>
    </v-row>
  </v-container>
</v-footer>

    </v-app>
  </v-responsive>
</template>

<style scoped>
.footer {
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
}

</style>