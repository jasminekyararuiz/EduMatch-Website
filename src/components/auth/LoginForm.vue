<template>
  <v-form fast-fail @submit.prevent>
    <v-text-field label="Email" variant="outlined"></v-text-field>

    <v-text-field label="Password" type="password" variant="outlined"></v-text-field>

    <v-autocomplete ref="Role" v-model="Role" :items="['Tutors', 'Learners']"
      :rules="[() => !!Role || 'This field is required']" label="Role" placeholder="Please select a role."
      required></v-autocomplete>

    <v-btn class="bg-primary" rounded="xl" type="submit" block>Log In</v-btn>
  </v-form>
</template>
