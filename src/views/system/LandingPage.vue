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
      <v-app-bar class="px-3" :color="theme === 'light' ? 'blue-lighten-3' : 'grey-darken-2'">
        <v-row>
          <v-col>
            <v-img src="/public/Edumatch_logo.png" width="30%"> </v-img>
          </v-col>
          <v-col>
            <v-btn class="bg-success text-center" rounded="xl" size="x-medium">Log In</v-btn>
          </v-col>
          <v-col>
            <v-btn class="bg-success text-center" rounded="xl" size="x-medium">Sign Up</v-btn>
          </v-col>
        </v-row>
        <v-spacer></v-spacer>

        <v-btn></v-btn>
        <v-spacer></v-spacer>
        <v-btn
          :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="elevated"
          slim
          @click="onClick"
        ></v-btn>
      </v-app-bar>

      <v-main>
        <v-container>
          <slot name="content"> </slot>
        </v-container>
      </v-main>

      <v-footer :color="theme === 'light' ? 'blue-lighten-5' : 'grey-darken-2'" border app>
        <span class="mx-auto">2025 - EduMatch</span>
      </v-footer>
    </v-app>
  </v-responsive>
</template>
