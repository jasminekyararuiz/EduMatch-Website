<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/utils/supabase'

const messages = ref([])
const search = ref('')
const fallbackAvatar = 'https://via.placeholder.com/150'

const composeDialog = ref(false)
const newMessage = ref({
  recipient: '',
  body: ''
})

const sendMessage = async () => {
  if (!newMessage.value.recipient || !newMessage.value.body) return

  const { error } = await supabase.from('messages').insert([
    {
      sender_name: 'You', // update based on logged-in user
      recipient: newMessage.value.recipient,
      body: newMessage.value.body
    }
  ])

  if (error) {
    console.error('Send error:', error)
  } else {
    composeDialog.value = false
    newMessage.value = { recipient: '', body: '' }
  }
}

const fetchMessages = async () => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching messages:', error)
  } else {
    messages.value = data
  }
}

const filteredMessages = computed(() =>
  messages.value.filter(m =>
    m.sender_name.toLowerCase().includes(search.value.toLowerCase())
  )
)

const goBack = () => {
  console.log('Back button pressed')
}

const formatTime = (datetime) => {
  const date = new Date(datetime)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  fetchMessages()
})

// Theme toggle
const theme = ref('light')
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <v-app :theme="theme">
    <!-- NAVBAR -->
    <v-app-bar :color="theme === 'light' ? 'indigo-darken-4' : 'grey-darken-4'" class="px-3">
      <v-row align="center" no-gutters class="w-100">
        <v-col cols="8" class="d-flex align-center">
          <v-img src="/public/Edumatch_logo.png" max-width="60" class="mr-2" />
          <span class="text-h6 font-weight-bold">
            <b>Edu</b><span class="text-cyan-darken-1"><b>Match</b></span>
          </span>
        </v-col>
        <v-col cols="4" class="d-flex justify-end align-center">
          <v-btn icon><v-icon>mdi-chat</v-icon></v-btn>
          <v-btn icon><v-icon>mdi-bell</v-icon></v-btn>
          <v-btn :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" slim @click="toggleTheme" />
          <v-avatar size="30"><v-img src="public/hee.jpg" /></v-avatar>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-container fluid class="pa-4" style="background: linear-gradient(to right, #cbd5e1, #94a3b8); min-height: 100vh;">
      <!-- Top Bar -->
      <v-row class="align-center mb-4">
        <v-col cols="12" md="8">
          <v-text-field v-model="search" density="comfortable" rounded prepend-inner-icon="mdi-magnify"
            placeholder="Search Messages" hide-details>
            <template #prepend>
              <v-btn icon flat @click="goBack">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <!-- Message List or Empty State -->
        <v-col cols="12" md="8">
          <v-sheet class="pa-4 rounded-xl" elevation="6" style="background-color: white;">
            <template v-if="filteredMessages.length > 0">
              <v-list>
                <v-list-item v-for="(message, index) in filteredMessages" :key="index" class="rounded-lg mb-2">
                  <v-list-item-avatar>
                    <v-img :src="message.avatar || fallbackAvatar"></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{ message.sender_name }}</v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action-text class="text-grey">
                    {{ formatTime(message.created_at) }}
                  </v-list-item-action-text>
                </v-list-item>
              </v-list>
            </template>

            <template v-else>
              <div class="text-center py-10">
                <v-icon size="56" color="grey">mdi-email-off-outline</v-icon>
                <h3 class="mt-2">No messages yet</h3>
                <p>You're all caught up for now.</p>
              </div>
            </template>
          </v-sheet>
        </v-col>

        <!-- Side Actions -->
        <v-col cols="12" md="4" class="d-flex flex-column align-center justify-start">
          <v-card class="pa-4 mt-6" rounded="xl" elevation="8" width="250">
            <v-btn block color="primary" class="mb-3" prepend-icon="mdi-pencil">
              Compose
            </v-btn>
            <v-btn block variant="outlined" class="mb-2" prepend-icon="mdi-inbox">
              Inbox
            </v-btn>
            <v-btn block variant="outlined" class="mb-2" prepend-icon="mdi-star-outline">
              Favorites
            </v-btn>
            <v-btn block variant="outlined" class="mb-2" prepend-icon="mdi-send">
              Sent
            </v-btn>
          </v-card>

          <v-dialog v-model="composeDialog" max-width="500">
            <v-card>
              <v-card-title>
                <span class="text-h6">New Message</span>
              </v-card-title>
              <v-card-text>
                <v-text-field v-model="newMessage.recipient" label="To" prepend-inner-icon="mdi-account" required />
                <v-textarea v-model="newMessage.body" label="Message" rows="4" auto-grow required />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn text @click="composeDialog = false">Cancel</v-btn>
                <v-btn color="primary" @click="sendMessage">Send</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </v-col>
      </v-row>
    </v-container>


    <!-- FOOTER -->
    <v-footer :color="theme === 'light' ? 'grey-lighten-4' : 'grey-darken-4'"
      :class="theme === 'light' ? 'text-black' : 'text-white'">
      <v-container fluid>
        <v-row align="center" justify="space-between">


          <!-- Left side: Logo and Tagline -->
          <v-col cols="12" md="4" class="d-flex flex-column align-center">
            <v-img class="mx-auto mb-2 mt-5 px-5" src="/public/Edumatch_logo.png" width="30%">
            </v-img>
            <span class="text-h3 font-weight-bold footer">
              <span class="text-blue-lighten-1"><b>Edu</b></span>
              <span class="text-indigo-darken-4"><b>Match</b></span>
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
                  <v-icon color="blue" size="18" class="me-2">mdi-instagram</v-icon> @lnheitmy
                </div>
                <div class="d-flex align-center mb-1 text-caption">
                  <v-icon color="blue" size="18" class="me-2">mdi-twitter</v-icon> @lenit
                </div>
                <div class="d-flex align-center mb-1 text-caption">
                  <v-icon color="blue" size="18" class="me-2">mdi-gmail</v-icon>
                  leanheitmayminoza@gmail.com
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
