<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const formRef = ref(null)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const submitForm = () => {
  if (formRef.value?.validate()) {
    console.log('Email:', email.value)
    console.log('Password:', password.value)
    // do something with the form
  }
}
</script>


<template>

    <v-form @submit.prevent="submitForm" ref="formRef" >
      <v-text-field
        v-model="email"
        type="email"
        label="Email"
        append-inner-icon="mdi-account"
        outlined
        dense
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        label="Password"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="togglePasswordVisibility"
        outlined
        dense
        required
      ></v-text-field>

      <v-select
                :items="['Learner', 'Tutor']"
                  label="Role"
                  class="role-select"
                  required
                  variant="underlined"
                  width="60%">

      </v-select>

      <v-btn class="bg-primary" rounded="xl" type="submit" block>Log In</v-btn>
    </v-form>

</template>
