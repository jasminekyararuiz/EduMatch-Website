<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import ProfileHeader from '@/components/layout/ProfileHeader.vue'

// Theme toggle
const theme = ref('light')
function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// Avatar logic
const avatarUrl = ref('/public/default-avatar.jpg')
const fileInputRef = ref(null)
function openFileDialog() {
  fileInputRef.value?.click()
}
function onFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    avatarUrl.value = URL.createObjectURL(file)
  }
}

// Reactive refs
const user = ref(null)
const bookedSessions = ref([])
const loading = ref(true)
const fetchError = ref(null)

onMounted(async () => {
  const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()

  if (userError || !currentUser) {
    fetchError.value = 'You must be logged in to view your sessions.'
    loading.value = false
    return
  }

  user.value = currentUser

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('learner_id', user.value.id)
    .order('session_date', { ascending: false })

  if (error) {
    fetchError.value = 'Failed to fetch sessions: ' + error.message
  } else {
    bookedSessions.value = data
  }

  loading.value = false
})
</script>

<template>
  <v-app :theme="theme">
    <!-- AppBar -->
    <v-app-bar class="px-3" :color="theme === 'light' ? 'indigo-darken-4' : 'grey-darken-2'">
      <v-row align="center" no-gutters class="w-100">
        <v-col cols="8" class="d-flex align-center">
          <v-img src="/public/Edumatch_logo.png" max-width="60" class="mr-2" />
          <span class="text-h6 font-weight-bold">
            <b>Edu</b><span class="text-cyan-darken-1"><b>Match</b></span>
          </span>
        </v-col>
        <v-col cols="4" class="d-flex justify-end align-center">
          <v-btn :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" slim @click="onClick" />
          <ProfileHeader />
        </v-col>
      </v-row>
    </v-app-bar>

 <!-- Main Content -->
<v-container fluid class="mt-4 px-5 pa-4" :class="theme === 'light' ? 'indigo-lighten-5' : 'grey-darken-3'">
  <v-row>

    <!-- Left Column -->
    <v-col cols="12" md="3" class="d-flex flex-column align-center mt-5">
      <!-- Avatar + Sidebar Content -->
      <v-avatar size="180" class="mt-6 border border-5">
      <v-img :src="avatarUrl" />
    </v-avatar>

    <v-btn
      class="text-caption text-grey-darken-1 mt-1"
      size="small"
      rounded="xl"
      density="compact"
      @click="openFileDialog"
    >
      <b>edit</b>
    </v-btn>

    <!-- Hidden file input -->
    <input
      type="file"
      accept="image/*"
      ref="fileInputRef"
      class="d-none"
      @change="onFileChange"
    />

      <v-card class="mt-4 px-4 py-3 text-center" rounded="lg" :color="theme === 'light' ? 'indigo-darken-4' : 'grey-darken-3'">
        <div class="text-body-2 font-italic mb-5">"Learning while earning"</div>
        <v-row justify="center" class="gap-2 mb-3">
          <v-icon small>mdi-facebook</v-icon>
          <v-icon small>mdi-instagram</v-icon>
          <v-icon small>mdi-linkedin</v-icon>
          <v-icon small>mdi-twitter</v-icon>
        </v-row>
        <v-divider class="my-2" />
        <v-btn class="text-grey-darken-1" rounded="xl" density="compact">
          <b>DASHBOARD</b>
        </v-btn>
      </v-card>
    </v-col>

    <!-- Middle Column -->
    <v-col cols="12" md="6" class="pa-6 mt-10">
      <v-card class="py-10 px-6 rounded-xl" elevation="1" :color="theme === 'light' ? 'grey-lighten-5' : 'grey-darken-4'">
        <h2 class="text-h5 font-weight-bold mb-6">Upcoming Sessions</h2>

        <!-- Loading Spinner -->
        <v-progress-circular v-if="loading" indeterminate color="primary" class="my-6" />

        <!-- Error Alert -->
        <v-alert v-if="fetchError" type="error" variant="outlined" class="mb-6">
          {{ fetchError }}
        </v-alert>

        <!-- No Sessions Alert -->
        <v-alert v-else-if="bookedSessions.length === 0 && !loading" type="info" variant="outlined" class="mb-6">
          You haven't booked or taught any sessions yet.
        </v-alert>

        <!-- Session Cards -->
        <v-row v-else>
          <v-col v-for="session in bookedSessions" :key="session.id" cols="12" sm="6">
            <v-card class="rounded-xl elevation-3 transition-swing" hover>
              <v-card-title class="text-h6 d-flex align-center text-primary">
                <v-icon start class="me-2">mdi-book-open-variant</v-icon>
                {{ session.subjects || 'Subject' }}
              </v-card-title>

              <v-card-subtitle class="text-body-2 d-flex align-center">
                <v-icon start class="me-1">mdi-calendar</v-icon>
                {{ session.session_date || 'No Date' }}
                <v-icon start class="ms-5 me-1">mdi-clock-time-four</v-icon>
                {{ session.session_time || 'Time N/A' }}
              </v-card-subtitle>

              <v-card-text class="pt-2">
                <v-chip :color="session.status === 'pending' ? 'green' : 'grey'" text-color="white" size="small" label>
                  <v-icon start small>mdi-check-circle</v-icon>
                  {{ session.status || 'Pending' }}
                </v-chip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <!-- Right Column -->
    <v-col cols="12" md="3" class="pa-6 mt-10">
      <v-card class="pa-4" elevation="2" rounded="xl" :color="theme === 'light' ? 'blue-lighten-5' : 'grey-darken-4'">
        <h4 class="text-subtitle-1 font-weight-bold mb-3">Messages</h4>
        <v-list density="compact">
          <v-list-item v-for="(tip, index) in ['message', 'message', 'message']" :key="index">
            <v-list-item-icon><v-icon small>mdi-lightbulb-on-outline</v-icon></v-list-item-icon>
            <v-list-item-content>{{ tip }}</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>

  </v-row>
</v-container>
<v-footer :color="theme === 'light' ? 'grey-lighten-4' : 'grey-darken-4'"
      :class="theme === 'light' ? 'text-black' : 'text-white'">
      <v-container fluid>
        <v-row align="center" justify="space-between">
          <!-- Left side: Logo and Tagline -->
          <v-col cols="12" md="4" class="d-flex flex-column align-center">
            <v-img class="mx-auto mb-2 mt-5 px-5" src="/public/Edumatch_logo.png" width="30%">
            </v-img>
            <span class="text-h3 font-weight-bold footer">
              <span class="text-blue-lighten-2"><b>Edu</b></span>
              <span class="text-blue-darken-4"><b>Match</b></span>
            </span>
            <p class="text-subtitle-2 text-grey-darken-1"><i>Turn Knowledge Into Opportunity</i></p>
          </v-col>

          <!-- Right side: Social Media -->
          <v-col cols="12" md="8">
            <div class="text-center mb-4">
              <h4 class="text-subtitle-1 font-weight-bold">CONNECT MORE WITH US</h4>
            </div>
            <v-row dense>
              <!-- Jasmine -->
              <v-col cols="12" sm="4" class="mb-4">
                <h5 class="text-body-2 font-weight-medium mb-2"><b>Jasmine Kyara Ruiz</b></h5>
                <div class="d-flex align-center mb-1 text-caption">
                  <v-icon color="blue" size="18" class="me-2">mdi-facebook</v-icon> Jasmine Kyara
                  Ruiz
                </div>
                <div class="d-flex align-center mb-1 text-caption">
                  <v-icon color="blue" size="18" class="me-2">mdi-instagram</v-icon> @offline_kyr
                </div>
                <div class="d-flex align-center mb-1 text-caption">
                  <v-icon color="blue" size="18" class="me-2">mdi-twitter</v-icon> @jazzzzmine24
                </div>
                <div class="d-flex align-center mb-1 text-caption">
                  <v-icon color="blue" size="18" class="me-2">mdi-gmail</v-icon>
                  jasminekyararuiz24@gmail.com
                </div>
                <div class="d-flex align-center text-caption">
                  <v-icon color="blue" size="18" class="me-2">mdi-linkedin</v-icon> Jasmine Kyara
                  Ruiz
                </div>
              </v-col>

              <!-- Leanheit -->
              <v-col cols="12" sm="4" class="mb-4">
                <h5 class="text-body-2 font-weight-medium mb-2"><b>Leanheit May Miñoza</b></h5>
                <div class="d-flex align-center mb-1 text-caption">
                  <v-icon color="blue" size="18" class="me-2">mdi-facebook</v-icon> Leanheit May
                  Miñoza
                </div>
                <div class="d-flex align-center mb-1 text-caption">
                  <v-icon color="blue" size="18" class="me-2">mdi-instagram</v-icon> lnheitmy
                </div>
                <div class="d-flex align-center mb-1 text-caption">
                  <v-icon color="blue" size="18" class="me-2">mdi-twitter</v-icon> lenit
                </div>
                <div class="d-flex align-center mb-1 text-caption">
                  <v-icon color="blue" size="18" class="me-2">mdi-gmail</v-icon>
                  leanheitmay@gmail.com
                </div>
                <div class="d-flex align-center text-caption">
                  <v-icon color="blue" size="18" class="me-2">mdi-linkedin</v-icon> Leanheit May
                  Miñoza
                </div>
              </v-col>

              <!-- Cristina -->
              <v-col cols="12" sm="4" class="mb-4">
                <h5 class="text-body-2 font-weight-medium mb-2"><b>Cristina Berwan</b></h5>
                <div class="d-flex align-center mb-1 text-caption">
                  <v-icon color="blue" size="18" class="me-2">mdi-facebook</v-icon> cristina
                </div>
                <div class="d-flex align-center mb-1 text-caption">
                  <v-icon color="blue" size="18" class="me-2">mdi-instagram</v-icon> @shas.shee
                </div>
                <div class="d-flex align-center mb-1 text-caption">
                  <v-icon color="blue" size="18" class="me-2">mdi-twitter</v-icon> @cristinaberwan
                </div>
                <div class="d-flex align-center mb-1 text-caption">
                  <v-icon color="blue" size="18" class="me-2">mdi-gmail</v-icon>
                  cristinaberwan@gmail.com
                </div>
                <div class="d-flex align-center text-caption">
                  <v-icon color="blue" size="18" class="me-2">mdi-linkedin</v-icon> Cristina Berwan
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- Divider & Copyright -->
        <v-divider class="my-6"></v-divider>
        <v-row justify="center">
          <span class="text-caption text-grey-darken-1">© 2025 EduMatch — All Rights Reserved.</span>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<style scoped>
.transition-swing {
  transition: transform 0.2s ease;
}
.transition-swing:hover {
  transform: translateY(-4px);
}
</style>
