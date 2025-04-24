<script setup>
import { requiredValidator, emailValidator } from '@/utils/validators'
import { ref } from 'vue'

const refVForm = ref()
const isPasswordVisible = ref(false)
const formDataDefault = {
  email: '',
  password: '',
  role: '',
}

const formData = ref({
  ...formDataDefault
})

const onLogin = () => {
alert (formData.value.password) 

} 

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid)
    onLogin()
  })
}
</script>

<template>
  <v-form ref="refVForm" @submit.preven="onFormSubmit">
    <v-text-field
      v-model="formData.email"
      prepend-inner-icon="mdi-email"
      label="Email"
      variant="outlined"
      :rules="[requiredValidator, emailValidator]"
    ></v-text-field>

    <v-text-field
      v-model="formData.password"
      prepend-inner-icon="mdi-lock"
      label="Password"
      variant="outlined"
      :type="isPasswordVisible ? 'text' : 'password'"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="isPasswordVisible = !isPasswordVisible"
      :rule="[requireValidator]"
    ></v-text-field>

    <v-row>
      <v-col class="text-center">
        <v-select
        v-model="formData.role"
          clearable
          label="Role"
          :items="['Learner', 'Tutor']"
           :rules="[roleValidator]"
          variant="underlined"
          width="40%"
        ></v-select>
      </v-col>
    </v-row>

    <v-btn class="bg-primary" rounded="xl" type="submit" block> <b>Log In</b></v-btn>
  </v-form>
</template>
