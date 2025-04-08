<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import LearnersignupForm from '@/components/auth/LearnersignupForm.vue'
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
                <v-text-field label="Password" type="password" variant="outlined"></v-text-field>
                <v-text-field label="Re-enter Password" type="password" variant="outlined"></v-text-field>

                <v-select clearable label="Role" :items="['Learner', 'Tutor']"
                variant="outlined" ></v-select>

                <v-btn class="bg-primary" rounded="xl" type="submit" block>Sign Up</v-btn>
              </v-form>

              <v-divider class="my-3"></v-divider>
              <h5 class="text-center">

                Already have an account? <RouterLink class="text-primary" to="/">Login</RouterLink>

              </h5>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
