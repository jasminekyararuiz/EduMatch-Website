<template>
  <v-form fast-fail @submit.prevent>
    <v-text-field label="Email" variant="outlined"></v-text-field>

    <v-text-field label="Password" type="password" variant="outlined"></v-text-field>

    <v-row>
      <v-col class="text-center">
        <v-select
          clearable
          label="Role"
          :items="['Learner', 'Tutor']"
          variant="underlined"
          width="40%"
        ></v-select>
      </v-col>
    </v-row>

    <v-btn class="bg-primary" rounded="xl" type="submit" block> <b>Log In</b></v-btn>
  </v-form>
</template>
