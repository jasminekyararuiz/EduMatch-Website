<script setup>
import { ref } from 'vue'
import { requiredValidator, emailValidator, passwordValidator, confirmedValidator } from '@/utils/validators'
import AlertNotification from '@/components/common/AlertNotification.vue'
import { supabase, formActionDefault } from '@/utils/supabase.js'
import { useRouter } from 'vue-router'
import { useAuthUserStore } from '@/stores/authUser'

const router = useRouter()

const formDataDefault = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: '',
}

const formData = ref({ ...formDataDefault })
const formAction = ref({ ...formActionDefault })

const isPasswordVisible = ref(false)
const isPasswordConfirmVisible = ref(false)
const refVForm = ref()

const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        firstname: formData.value.firstname,
        lastname: formData.value.lastname,
        role: formData.value.role,
      },
    },
  })

  if (error) {
    console.log(error)
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    // Update user store to mark them as authenticated
    const authStore = useAuthUserStore()
    authStore.setUser(data.user)  // Store user data
    authStore.setAuthenticated(true)  // Mark user as authenticated

    formAction.value.formSuccessMessage = 'Successfully Registered Account'

    // Route based on role
    const role = formData.value.role?.toLowerCase()
    if (role === 'learner') {
      router.replace('/findtutor')
    } else if (role === 'tutor') {
      router.replace('/tutorapplication')
    }

    // Reset form after submission
    refVForm.value?.reset()
  }

  formAction.value.formProcess = false
}

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}

const roleValidator = (value) => !!value || 'Please select a role'
</script>

<template>
  <AlertNotification :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"></AlertNotification>

  <v-form class="mt-5" ref="refVForm" @submit.prevent="onFormSubmit">
    <v-row>
      <v-col>
        <v-text-field v-model="formData.firstname" label="First Name" :rules="[requiredValidator]" variant="outlined" />
      </v-col>
      <v-col>
        <v-text-field v-model="formData.lastname" label="Last Name" :rules="[requiredValidator]" variant="outlined" />
      </v-col>
    </v-row>

    <v-text-field v-model="formData.email" label="Email" variant="outlined" prepend-inner-icon="mdi-email"
      :rules="[requiredValidator, emailValidator]" />

    <v-text-field v-model="formData.password" label="Password" :type="isPasswordVisible ? 'text' : 'password'"
      variant="outlined" :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="isPasswordVisible = !isPasswordVisible" :rules="[requiredValidator, passwordValidator]" />

    <v-text-field v-model="formData.password_confirmation" label="Password Confirmation"
      :type="isPasswordConfirmVisible ? 'text' : 'password'" variant="outlined"
      :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
      :rules="[requiredValidator, confirmedValidator(formData.password_confirmation, formData.password)]" />

    <v-select v-model="formData.role" label="Role" :items="['Learner', 'Tutor']" variant="outlined"
      :rules="[roleValidator]" />

    <v-btn class="bg-primary" rounded="xl" type="submit" block :disabled="formAction.formProcess"
      :loading="formAction.formProcess"><b>Sign Up</b></v-btn>
  </v-form>
</template>
