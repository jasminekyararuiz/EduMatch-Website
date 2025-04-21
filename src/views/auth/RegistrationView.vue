<script setup>
import { ref } from 'vue';
import { VIcon } from 'vuetify/components';
import AppLayout from '@/components/layout/AppLayout.vue'

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const role = ref('');
const roles = ['Learner', 'Tutor'];

const submitForm = () => {
  console.log({
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
    role: role.value
  });
};

const signInWithGoogle = () => {
  // Placeholder for Google OAuth logic
  console.log('Redirecting to Google OAuth...');
};

const signInWithTelegram = () => {
  // Placeholder for Telegram Login logic
  console.log('Redirecting to Telegram Login...');
};
</script>

<template>

 <AppLayout>
    <template #content>

      <v-row :color="theme === 'light' ? 'blue-lighten-5' : 'blue-lighten-5'" :class="theme === 'light' ? 'text-black' : 'text-white'">
        <v-col cols="12" md="6" class="mx-auto">
          <v-card elevation="10" class="mx-auto" color="blue-lighten-5">
            <v-card-title>
              <v-img class="mx-auto" src="/public/Edumatch_logo.png" width="25%"> </v-img>
              <h3 class="text-center edu"><b>EduMatch</b></h3>
            </v-card-title>
            </v-card>
            </v-col>

           <v-app>
    <v-main class="bg-cover " :style="{ backgroundImage: 'url(/ccis.jpg)' }">
      <v-container class="mx-auto d-flex align-center justify-center fill-height">

       <v-card>
          <v-card-title>
            <v-col >
                <div class="left-content">
                  <h2 class="text-h5 text-center">Welcome to EduMatch</h2>
                  <p class="text-center">
                    Connecting learners and tutors worldwide. Join us today!
                  </p>
                  <v-img
                    class="mx-auto py-3"
                    src="/public/Edumatch_logo.png"
                    width="60%"
                  ></v-img>
                </div>
                <v-form>
                </v-form>
            <v-row>
               <v-col >
                <v-text-field
                  v-model="firstName"
                  label="First Name"
                  prepend-inner-icon="mdi-account"
                  required
                ></v-text-field>
              </v-col>
              <v-col >
                <v-text-field
                  v-model="lastName"
                  label="Last Name"
                  prepend-inner-icon="mdi-account"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              prepend-inner-icon="mdi-email"
              required
            ></v-text-field>

<<<<<<< HEAD
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              prepend-inner-icon="mdi-lock"
              required
            ></v-text-field>
=======
                <v-btn class="bg-primary" rounded="xl" type="submit" block><b>Sign Up</b></v-btn>
              </v-form>
>>>>>>> 6ead8cf71b88bf36b5b05ed5ccef4f5de930bcd1

            <v-text-field
              v-model="confirmPassword"
              label="Re-enter Password"
              type="password"
              prepend-inner-icon="mdi-lock-check"
              required
            ></v-text-field>

            <v-select
              v-model="role"
              :items="roles"
              label="Role"
              prepend-inner-icon="mdi-account-group"
              required
            ></v-select>

            <v-btn class="mt-4" color="primary" block @click="submitForm">
              <v-icon left>mdi-account-plus</v-icon>Sign Up
            </v-btn>

            <v-divider class="my-4" width="60%"></v-divider>

            <v-btn block color="green-darken-1" class="mb-2" @click="signInWithGoogle">
              <v-img class="mx-auto" src="public/google_logo.jpg"></v-img>Sign up with Google
            </v-btn>

            <v-btn block color="blue-darken-3" class="mb-2" @click="signInWithTelegram">
              <v-icon left>mdi-telegram</v-icon>Sign up with Telegram
            </v-btn>

            <div class="mt-3 text-center">
              Already have an account?
              <RouterLink class="text-primary" to="/login">Login</RouterLink>
            </div>
          </v-form>
              </v-col>

          </v-card-title>

       </v-card>




      </v-container>
    </v-main>
    </v-app>
      </template>
      </AppLayout>
</template>
<style scoped>
.bg-cover {
  background-size: cover;
  background-position: center;
}





.edu {
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
}
</style>

