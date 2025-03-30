<script setup>
import { ref } from 'vue'

const theme = ref('light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar class="px-3" color="blue-lighten-3">
        <v-spacer></v-spacer>

        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          text="Toggle Theme"
          slim
          @click="onClick"
        ></v-btn>
      </v-app-bar>

      <v-main>
        <v-container>
          <v-row>
            <v-col cols="12" md="6" class="mx-auto">
              <v-card class="mx-auto" prepend-icon=" mdi-account-plus" subtitle="Sign Up">
                <template v-slot:title>
                  <span class="font-weight-black">EduMatch</span>
                </template>

                <v-card-text class="bg-surface-light pt-4">
                   
                  <v-sheet class="mx-auto">
                    <v-form fast-fail @submit.prevent>
                        <v-row>
                        <v-col>
                            <v-text-field label="First Name" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field label="Last Name" variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>
                      <v-text-field label="Email" variant="outlined"></v-text-field>
                      <v-text-field
                        label="Password"
                        type="password"
                        variant="outlined"
                      ></v-text-field>
                      <v-text-field
                        label="Re-enter Password"
                        type="password"
                        variant="outlined"
                      ></v-text-field>

                      <v-btn class="mt-2" type="submit" block>Sign Up</v-btn>
                    </v-form>
                    <v-divider class="my-3" ></v-divider>
                    <h5 class="text-center">Already have an acoount? <RouterLink class="text-primary" to="/">Login</RouterLink></h5>
                  </v-sheet>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>

      <v-footer border color="blue-lighten-5" app>2025 - EduMatch</v-footer>
    </v-app>
  </v-responsive>
</template>
