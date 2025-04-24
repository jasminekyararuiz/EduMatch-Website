<script setup>
import { ref } from 'vue'
import FooterLayout from '@/components/layout/FooterLayout.vue'
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()
const theme = ref('light')
function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const steps = [
  {
    title: "Create a Profile",
    description:
      "Sign up as a student or an educator. Fill in your interests, goals, expertise, and availability. This helps EduMatch understand what you’re looking for or what you can offer.",
  },
  {
    title: "Get Matched Intelligently",
    description:
      "Our system uses smart matching to connect students with educators, programs, or mentors based on learning preferences, goals, and subject areas. No more random pairings — everything is curated for your needs.",
  },
  {
    title: "Engage & Collaborate",
    description:
      "Once matched, students and educators can communicate, schedule sessions, share resources, and collaborate through the platform’s tools. Everything is organized to keep learning smooth and engaging.",
  },
  {
    title: "Track Progress & Feedback",
    description:
      "Both students and mentors can view progress, give feedback, and adjust goals as needed. EduMatch helps keep everything transparent, measurable, and learner-focused.",
  },
  {
    title: "Grow With the Community",
    description:
      "Learning doesn't stop at the match. EduMatch encourages meaningful connections between learners and tutors — whether sessions happen face-to-face or online, it’s all based on what works best for both. Build trust, grow skills, and reach your goals together.",
  }
]
</script>

<template>
    <v-app :theme="theme">
      <!-- Top Navigation -->
 <v-app-bar class="px-3" :color="theme === 'light' ? 'indigo-darken-4' : 'grey-darken-2'">

  <v-row align="center" no-gutters class="w-100">
    <!-- Logo and Brand -->
    <v-col cols="8" class="d-flex align-center">
      <v-img
        src="/public/Edumatch_logo.png"
        alt="EduMatch Logo"
        max-width="60"
        class="mr-2"
      ></v-img>
      <span class="text-h6 font-weight-bold edu">
      <span class="text-blue-lighten-5"><b>Edu</b></span>
      <span class="text-blue-lighten-3"><b>Match</b></span>
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
        color="cyan-darken-3"
        class="text-white"
      ><b>Log In</b></v-btn> </RouterLink>
      <RouterLink to="/registration">
      <v-btn
        rounded="xl"
        variant="elevated"
        density="comfortable"
        color="cyan-darken-3"
        class="text-white ml-2"
      ><b>Sign Up</b></v-btn>
    </RouterLink>
      <v-spacer></v-spacer>
      <v-btn
          :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="solo"
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
    height="550px"
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
                  <img src="/public/bg-student.png" alt="student" class="student-img" />
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
              <h1 class="text-center mb-5"> <b>Why choose </b>
                <span class="text-h4 font-weight-bold edu">
      <span class="text-blue-lighten-2"><b>Edu</b></span>
      <span class="text-blue-darken-4"><b>Match</b></span>
      </span> <b>?</b>
              </h1>
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
<v-container fluid class="pa-0 mb-5" >
  <div :style="{ backgroundColor: theme === 'light' ? '#E3F2FD' : '#1E1E1E' }">
          <v-container class="py-12">
            <!-- TITLE + DESCRIPTION -->
            <v-row justify="center">
              <v-col cols="12" class="text-center">
                <h2 class="text-h4 font-weight-bold mb-4">How It Works</h2>
                <p class="text-subtitle-2 font-weight-medium mb-3">
                  EduMatch simplifies the journey of finding the right learning path. <br>
                  Whether you're a student seeking guidance or a teacher ready
                  to share knowledge, here's how it works:
                </p>
              </v-col>
            </v-row>

            <!-- First Row: Steps 1–3 -->
            <v-row class="mt-8" justify="center" align="stretch">
              <v-col v-for="(step, index) in steps.slice(0, 3)" :key="index" cols="12" sm="4" md="3" class="d-flex">
                <v-card class="pa-6 text-center" elevation="2">
                  <!-- Number Box -->
                  <div class="mx-auto mb-5 text-h6   font-weight-bold d-flex align-center justify-center" :style="{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: theme === 'light' ? '#1976d2' : '#90caf9',
                    color: theme === 'light' ? '#fff' : '#000',
                  }">
                    {{ index + 1 }}
                  </div>
                  <!-- Title & Description -->
                  <div class="text-subtitle-1 font-weight-bold mb-5">{{ step.title }}</div>
                  <div class="text-body-2">{{ step.description }}</div>
                </v-card>
              </v-col>
            </v-row>

            <!-- Second Row: Steps 4–5 -->
            <v-row justify="center" align="stretch">
              <v-col v-for="(step, index) in steps.slice(3)" :key="index + 3" cols="12" sm="4" md="3" class="d-flex">
                <v-card class="pa-6 text-center" elevation="2">
                  <!-- Number Box -->
                  <div class="mx-auto mb-5 text-h6 font-weight-bold d-flex align-center justify-center" :style="{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: theme === 'light' ? '#1976d2' : '#90caf9',
                    color: theme === 'light' ? '#fff' : '#000',
                  }">
                    {{ index + 4 }}
                  </div>
                  <!-- Title & Description -->
                  <div class="text-subtitle-1 font-weight-bold mb-5">{{ step.title }}</div>
                  <div class="text-body-2">{{ step.description }}</div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </div>
</v-container>

<v-container fluid class="mt-5">
            <v-sheet
            :color="theme === 'light' ? 'indigo-lighten-5' : 'grey-darken-2'"
    elevation="2"
    class="rounded-lg pa-8">
              <h1 class="text-center mb-5"> <b>Get To Know More About </b>
                <span class="text-h4 font-weight-bold edu">
      <span class="text-blue-lighten-2"><b>Edu</b></span>
      <span class="text-blue-darken-4"><b>Match</b></span>
      </span>
              </h1>
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






      <v-footer :color="theme === 'light' ? 'grey-lighten-4' : 'grey-darken-4'" :class=" theme === 'light' ? 'text-black' : 'text-white'">

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
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: x-large;
}

.choose p {
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif
}

.edu {
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
}

  </style>
