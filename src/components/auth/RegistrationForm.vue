<script setup>
import { requiredValidator, emailValidator, passwordValidator } from '@/utils/validators'
import { ref } from 'vue'

const formDataDefault = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  password_confirmation: '',
}

const formData = ref({
  ...formDataDefault,
})

const isPasswordVisible = ref(false)
const isPasswordConfirmVisible = ref(false)
const refVForm = ref()

const onSubmit = () => {
  alert(formData.value.password)
}

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>

<template>
  <v-form ref="refVForm" @submit.preven="onFormSubmit">
    <v-row>
      <v-col>
        <v-text-field
          v-model="formData.firstname"
          label="First Name"
          :rules="[requiredValidator]"
          variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="formData.lastname"
          label="Last Name"
          :rules="[requiredValidator]"
          variant="outlined"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-text-field
      v-model="formData.email"
      label="Email"
      variant="outlined"
      prepend-inner-icon="mdi-email"
      :rules="[requiredValidator, emailValidator]"
    ></v-text-field>
    <v-text-field
      v-model="formData.password"
      label="Password"
      type="password"
      variant="outlined"
      :type="isPasswordVisible ? 'text' : 'password'"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="isPasswordVisible = !isPasswordVisible"
      :rule="[requireValidator, passwordValidator]"
    ></v-text-field>

    <v-text-field
      v-model="formData.password_confirmation"
      label="Password Confirmation"
      class="text-end"
      type="password"
      variant="outlined"
      :type="isPasswordConfirmVisible ? 'text' : 'password'"
      :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="isPasswordConfirmVisible = !isPasswordVisible"
      :rule="[
        requireValidator,
        confirmedValidator(formData.password_confirmation, formData.password),
      ]"
    >
    </v-text-field>

    <v-select clearable label="Role" :items="['Learner', 'Tutor']" variant="outlined"></v-select>

    <v-btn class="bg-primary" rounded="xl" type="submit" block><b>Sign Up</b></v-btn>
  </v-form>
</template>

<style scope></style>
