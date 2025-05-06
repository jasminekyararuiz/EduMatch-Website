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
const activeSession = ref(null)
const messages = ref([])
const newMessage = ref('')

const loadMessages = async (sessionId) => {
  activeSession.value = sessionId
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  if (!error) {
    messages.value = data
  } else {
    console.error('Failed to load messages:', error.message)
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !activeSession.value) return

  const { error } = await supabase.from('messages').insert([{
    session_id: activeSession.value,
    sender_id: user.value.id,
    message_text: newMessage.value.trim(),
  }])

  if (!error) {
    newMessage.value = ''
    await loadMessages(activeSession.value)
  } else {
    console.error('Failed to send message:', error.message)
  }
}

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
    .eq('tutor_id', user.value.id)
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
        <RouterLink to="/tutorapplication" class="text-decoration-none">
          <h4 class="text-white" block text prepend-icon="mdi-file-document">SUBMIT APPLICATION</h4>
        </RouterLink>
        <v-btn class="text-grey-darken-1" rounded="xl" density="compact">
          <b>DASHBOARD</b>
        </v-btn>
      </v-card>
    </v-col>

 <!-- Middle Column -->
<v-col cols="12" md="6" class="pa-6 mt-10">
  <v-card class="py-10 px-6 rounded-xl" elevation="1" :color="theme === 'light' ? 'grey-lighten-5' : 'grey-darken-4'">
    <h2 class="text-h5 font-weight-bold mb-6">Your Booked Sessions</h2>

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
        <v-card class="rounded-xl elevation-3 transition-swing" hover @click="loadMessages(session.id)">
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

<!-- Right Column: Chat -->
<v-col cols="12" md="3" class="d-flex flex-column pa-6 mt-10">
  <v-card class="d-flex flex-column flex-grow-1" elevation="2">
    <v-card-title class="text-h6">
      Chat
    </v-card-title>
    <v-divider></v-divider>

    <!-- Message History -->
    <v-card-text class="flex-grow-1 overflow-y-auto" style="max-height: 400px;">
      <v-list dense>
        <v-list-item
          v-for="msg in messages"
          :key="msg.id"
          :class="msg.sender_id === user.id ? 'justify-end' : 'justify-start'"
        >
          <v-chip
            :color="msg.sender_id === user.id ? 'blue lighten-4' : 'green lighten-4'"
            class="ma-1"
            label
          >
            {{ msg.sender_id === user.id ? 'You' : 'Them' }}: {{ msg.message_text }}
          </v-chip>
        </v-list-item>
      </v-list>
    </v-card-text>

    <!-- Input -->
    <v-divider></v-divider>
    <v-card-actions>
      <v-text-field
        v-model="newMessage"
        placeholder="Type a message..."
        hide-details
        density="compact"
        class="flex-grow-1"
        @keyup.enter="sendMessage"
      ></v-text-field>
      <v-btn icon @click="sendMessage" :disabled="!activeSession">
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </v-card-actions>
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
