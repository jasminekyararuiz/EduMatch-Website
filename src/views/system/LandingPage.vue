<script setup>
import { ref } from 'vue'

const theme = ref('light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
    <v-app :theme="theme">
      <!-- Top Navigation -->
 <v-app-bar class="px-3" :color="theme === 'light' ? 'blue-lighten-3' : 'grey-darken-2'">

  <v-row align="center" no-gutters class="w-100">
    <!-- Logo and Brand -->
    <v-col cols="8" class="d-flex align-center">
      <v-img
        src="/public/Edumatch_logo.png"
        alt="EduMatch Logo"
        max-width="60"
        class="mr-2"
      ></v-img>
      <span class="text-h6 font-weight-bold">
        <b>Edu</b><span class="text-primary"><b>Match</b></span>
      </span>
    </v-col>

    <!-- Center Nav Buttons -->


    <!-- Auth Buttons and Theme Toggle -->
    <v-col cols="4" class="d-flex justify-end align-center">
        <v-btn variant="text" class="text-body-2 ml-4">How it works</v-btn>
        <v-btn variant="text" class="text-body-2 ml-4">About Us</v-btn>


    <RouterLink to="/">
        <v-btn
        rounded="xl"
        variant="elevated"
        density="comfortable"
        color="indigo-darken-4"
        class="text-white"
      ><b>Log In</b></v-btn> </RouterLink>
      <RouterLink to="/registration"> 
      <v-btn
        rounded="xl"
        variant="elevated"
        density="comfortable"
        color="indigo-darken-4"
        class="text-white ml-2"
      ><b>Sign Up</b></v-btn>
    </RouterLink>
      <v-spacer></v-spacer>
      <v-btn
          :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="elevated"
          slim
          @click="onClick"
        ></v-btn>
    </v-col>
  </v-row>
</v-app-bar>


  
      <!-- Hero Section -->
      <v-main>
        <v-container fluid class="pa-0">
            <v-img
    src="/public/ccis.jpg"
    height="500px"
    cover
    class="hero-section"
  >
    <!-- Dark overlay -->
    <div class="dark-overlay"></div>

    <v-container class="fill-height content-wrapper">
      <v-row class="fill-height align-center">
        <!-- Text Area -->
        <v-col cols="12" md="6">
          <div class="hero-text">
            <h1 class="text-white font-weight-bold text-h2">
              Face-to-face learning<br />with top tutors
            </h1>
            <p class="text-info mt-2">
             <i>"Turn Knowledge Into Opportunity"</i>
            </p>
          </div>
        </v-col>

        <!-- Image of the student -->
        <v-col cols="12" md="6" class="image-col">
          <img
            src="/public/bg-student.png"
            alt="student"
            class="student-img"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-img>

  
          <!-- Why Choose Us -->
          <v-container fluid class="mt-5">
            <v-sheet
            :color="theme === 'light' ? 'indigo-lighten-5' : 'grey-darken-2'"
    elevation="2"
    class="rounded-lg pa-8">
              <h1 class="text-center mb-5"><b>Why choose EduMatch?</b></h1>
              <v-row justify="center" class="choose gap-4">
                <v-col cols="12" sm="4">
                  <v-card class="text-center pa-4" elevation="4">
                    <v-icon color="indigo" size="48">mdi-book-open-variant</v-icon>
                    <p class="text-h6 font-weight-medium mt-2"> <b>Expert Tutors</b> </p>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-card class="text-center pa-4" elevation="4">
                    <v-icon color="indigo" size="48">mdi-cash-multiple</v-icon>
                    <p class="text-h6 font-weight-medium mt-2"> <b> Affordable Rates</b></p>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-card class="text-center pa-4" elevation="4">
                    <v-icon color="indigo" size="48">mdi-handshake</v-icon>
                    <p class="text-h6 font-weight-medium mt-2"> <b>Interactive Sessions</b></p>
                  </v-card>
                </v-col>
              </v-row>
            </v-sheet>
          </v-container>
        </v-container>
      </v-main>
      
    </v-app>
  </template>
  

  
  <style scoped>
  .text-white {
    color: white !important;
  }
  .mt-n10 {
    margin-top: -80px;
  }
  .hero-section {
  position: relative;
}

.dark-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.content-wrapper {
  position: relative;
  z-index: 2;
}

.hero-text h1,
.hero-text p {
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
}

.image-col {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}

.student-img {
  max-width: 400px;
  object-fit: contain;
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 3;
}

.hero-text h1 {
    font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    font-size: x-large;
}

.choose p{
    font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif
}

  </style>