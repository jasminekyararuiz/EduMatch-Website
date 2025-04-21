<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import LoginForm from '@/components/auth/LoginForm.vue'


// Removed unused 'mobile' variable
</script>

<template>
  <AppLayout>
    <template #content>


      <v-row  class="bg-blue-lighten-5 " >
        <v-col cols="7" class="text-start d-none d-md-flex rounded-xl">

          <v-img class="mx-auto py-5 mt-5" src="/public/EduMatch-LogIn.png" >

          </v-img>
          <div class="text-overlay ">
            <h1 class=" font-weight-bold">Welcome to EduMatch</h1>
            <p class="bold ">Connecting learners and tutors worldwide</p>
          </div>


        </v-col>
        <br>
        <v-col cols="5" class="mx-auto " > <br>
          <v-card class="mx-auto rounded-lg" >

            <v-card-title class="py-4 rounded-lg">
              <v-img class="mx-auto" src="/public/Edumatch_logo.png" width="25%"> </v-img>
              <h3 class="text-center"><b>EduMatch</b></h3>


            </v-card-title>

            <v-card-text class="bg-surface-light pt-4  ">
              <LoginForm></LoginForm>

              <v-divider class="my-3 py-4" >
              <h5 class="text-center">
                Don't have account?
                <RouterLink class="text-primary" to="/registration">Click here to register </RouterLink>
              </h5>
            </v-divider>
            </v-card-text>
          </v-card>

        </v-col>
      </v-row>
    </template>

  </AppLayout>
</template>
<style scoped>
/* Style for the text overlay */
.text-overlay {
  position: absolute;
  top: 23%; /* Adjust this value to move the text vertically */
  left: 50%;
  transform: translate(-100%, -30%);
  z-index: 1;
}

.text-overlay h1 {
  font-size: 2.0rem;
  margin-bottom: 0.5rem;
  font-family: 'Times New Roman', Times, serif  ;
}

.text-overlay p {
  font-size: 1.2rem;
  color: rgb(19, 27, 35);
}

.image-container {
  position: relative;
  z-index: 0;
}
</style>
