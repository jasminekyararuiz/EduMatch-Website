<script setup>
import { ref } from 'vue'

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
  <v-responsive>
    <v-app :theme="theme">
      <!-- NAVBAR -->
      <v-app-bar class="px-3" :color="theme === 'light' ? 'blue-lighten-3' : 'grey-darken-2'">
        <v-row>
          <v-col>
            <v-img src="/public/Edumatch_logo.png" width="30%" />
          </v-col>
          <v-col>
            <v-btn class="bg-success text-center" rounded="xl" size="x-medium">Log In</v-btn>
          </v-col>
          <v-col>
            <v-btn class="bg-success text-center" rounded="xl" size="x-medium">Sign Up</v-btn>
          </v-col>
        </v-row>
        <v-spacer></v-spacer>
        <v-btn :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" variant="elevated" slim
          @click="onClick"></v-btn>
      </v-app-bar>

      <!-- MAIN CONTENT -->
      <v-main>
        <!-- How It Works Section with Background -->
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
      </v-main>

      <!-- FOOTER -->
      <v-footer :color="theme === 'light' ? 'blue-lighten-5' : 'grey-darken-2'" border app>
        <span class="mx-auto">2025 - EduMatch</span>
      </v-footer>
    </v-app>
  </v-responsive>
</template>

<style scoped>
h2 {
  font-family: 'Times New Roman', sans-serif;
  font-weight: 600;
}
</style>
