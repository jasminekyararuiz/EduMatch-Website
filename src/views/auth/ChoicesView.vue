<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>

<template>
  <v-btn icon="mdi-arrow-left"></v-btn>
  <AppLayout>
    <template #content>
      <v-row>
        <v-col cols="8" md="6">
          <v-card class="mx-auto my-12" max-width="374">
            <v-img height="300" src="public/learner.png" cover></v-img>

            <v-card-item>
              <v-card-title class="text-center"><b>I am a Learner</b></v-card-title>
            </v-card-item>

            <v-card-text>
              <v-row align="center" class="mx-0">

              </v-row>

              <div class="my-4 text-subtitle-1">

              </div>


              <br>
              <div class="text-center">I’ll find the right tutor to help me understand my lessons better.</div>
            </v-card-text>

            <v-divider class="mx-4 mb-1"></v-divider>

            <v-card-actions>
              <v-btn class="bg-primary" text="Learner Sign Up" block border @click="reserve"></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="8" md="6">
          <v-card :disabled="loading" :loading="loading" class="mx-auto my-12" max-width="374">
            <template v-slot:loader="{ isActive }">
              <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate></v-progress-linear>
            </template>

            <v-img height="300" src="public/tutorr.png" cover></v-img>

            <v-card-item>
              <v-card-title class="text-center"><b>I am a Tutor</b></v-card-title>
            </v-card-item>

            <v-card-text>
              <v-row align="center" class="mx-0">

              </v-row>

              <div class="my-4 text-subtitle-1">

              </div>
              <br>
              <div class="text-center">I teach students and earn while sharing my knowledge.</div>
            </v-card-text>

            <v-divider class="mx-4 mb-1"></v-divider>

            <v-card-actions>
              <v-btn class="bg-primary" text="Tutor Sign Up" block border @click="reserve"></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col class="2" md="1">
          <RouterLink class="text-primary" to="/">Back</RouterLink>
        </v-col>


      </v-row>


    </template>
  </AppLayout>

</template>
