<template>
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

    <v-btn class="bg-primary" rounded="xl" type="submit" block>Sign Up</v-btn>
  </v-form>
</template>
