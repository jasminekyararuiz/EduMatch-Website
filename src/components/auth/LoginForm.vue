<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AlertNotification from '@/components/common/AlertNotification.vue'
import { supabase, formActionDefault } from '@/utils/supabase.js'
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
} from '@/utils/validators'

const router = useRouter()
const refVForm = ref()
const isPasswordVisible = ref(false)

const formDataDefault = {
  email: '',
  password: '',
  role: '',
}
const formData = ref({ ...formDataDefault })
const formAction = ref({ ...formActionDefault })

const roleValidator = value => !!value || 'Please select a role'

const onSubmit = async () => {
  formAction.value = { ...formActionDefault, formProcess: true }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password,
  })

  if (error) {
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
    formAction.value.formProcess = false
    return
  }

  // Get role from Supabase metadata
  const actualRole = data.user?.user_metadata?.role?.toLowerCase()
  const selectedRole = formData.value.role?.toLowerCase()

  if (actualRole !== selectedRole) {
    formAction.value.formErrorMessage = `This account is registered as a "${actualRole}". Please select the correct role.`
    formAction.value.formProcess = false
    return
  }

  formAction.value.formSuccessMessage = 'Successfully Logged In'

  if (actualRole === 'learner') {
    router.replace('/findtutor')
  } else if (actualRole === 'tutor') {
    router.replace('/tutorapplication')
  } else {
    router.replace('/')
  }

  refVForm.value?.reset()
  formAction.value.formProcess = false
}


const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>

<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  />

  <v-form class="mt-5" ref="refVForm" @submit.prevent="onFormSubmit">
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
      variant="outlined"
      :type="isPasswordVisible ? 'text' : 'password'"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="isPasswordVisible = !isPasswordVisible"
      :rules="[requiredValidator, passwordValidator]"
    />

    <v-select
      v-model="formData.role"
      label="Role"
      :items="['Learner', 'Tutor']"
      variant="outlined"
      
      :rules="[roleValidator]"
      clearable
    />

    <v-btn
      class="bg-primary"
      rounded="xl"
      type="submit"
      block
      :loading="formAction.formProcess"
      :disabled="formAction.formProcess"
    >
      <b>Log In</b>
    </v-btn>
  </v-form>
</template>
