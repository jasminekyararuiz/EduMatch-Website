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
        <v-spacer></v-spacer>

        <v-btn :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" variant="elevated" slim
          @click="onClick"></v-btn>
      </v-app-bar>

      <v-main>
        <v-container>
          <slot name="content"> </slot>
        </v-container>
      </v-main>

      <v-footer :color="theme === 'light' ? 'blue-lighten-5' : 'grey-darken-2'" border app>
        <v-layout class="overflow-visible" style="height: 56px;">
          <v-bottom-navigation v-model="value" :bg-color="color" mode="shift">
            <v-btn>
              <v-icon>mdi-television-play</v-icon>

              <span>Video</span>
            </v-btn>

            <v-btn>
              <v-icon>mdi-music-note</v-icon>

              <span>Music</span>
            </v-btn>

            <v-btn>
              <v-icon>mdi-book</v-icon>

              <span>Book</span>
            </v-btn>

            <v-btn>
              <v-icon>mdi-image</v-icon>

              <span>Image</span>
            </v-btn>
          </v-bottom-navigation>
        </v-layout>
        <span class="mx-auto">2025 - EduMatch</span>
      </v-footer>
    </v-app>
  </v-responsive>
</template>
