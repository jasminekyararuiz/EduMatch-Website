<script setup>
import { requiredValidator, emailValidator, passwordValidator, confirmedValidator } from '@/utils/validators'
import { ref } from 'vue'

const formDataDefault = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: '',
}

const formData = ref({ ...formDataDefault })
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
const roleValidator = value => !!value || 'Please select a role'

</script>

<template>
  <v-form ref="refVForm" @submit.prevent="onFormSubmit">
    <v-row>
      <v-col>
        <v-text-field
          v-model="formData.firstname"
          label="First Name"
          :rules="[requiredValidator]"
          variant="outlined"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="formData.lastname"
          label="Last Name"
          :rules="[requiredValidator]"
          variant="outlined"
        />
      </v-col>
    </v-row>

    <v-text-field
      v-model="formData.email"
      label="Email"
      variant="outlined"
      prepend-inner-icon="mdi-email"
      :rules="[requiredValidator, emailValidator]"
    />

    <v-text-field
      v-model="formData.password"
      label="Password"
      :type="isPasswordVisible ? 'text' : 'password'"
      variant="outlined"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="isPasswordVisible = !isPasswordVisible"
      :rules="[requiredValidator, passwordValidator]"
    />

    <v-text-field
      v-model="formData.password_confirmation"
      label="Password Confirmation"
      :type="isPasswordConfirmVisible ? 'text' : 'password'"
      variant="outlined"
      :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
      :rules="[
        requiredValidator,
        confirmedValidator(formData.password_confirmation, formData.password),
      ]"
    />

    <v-select
  v-model="formData.role"
  label="Role"
  :items="['Learner', 'Tutor']"
  variant="outlined"
  :rules="[roleValidator]"
  clearable
/>


    <v-btn class="bg-primary" rounded="xl" type="submit" block><b>Sign Up</b></v-btn>
  </v-form>
</template>
