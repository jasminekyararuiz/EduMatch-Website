<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/utils/supabase'


// Theme toggle
const theme = ref('light')
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const messageDialog = ref(false)
const composeDialog = ref(false)

const search = ref('')
const messages = ref([])

const fallbackAvatar = 'https://via.placeholder.com/150'
const newMessage = ref({ recipient: '', body: '' })

const fetchMessages = async () => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (!error) messages.value = data
}

const sendMessage = async () => {
  if (!newMessage.value.recipient || !newMessage.value.body) return

  const { error } = await supabase.from('messages').insert([
    {
      sender_name: 'You',
      recipient: newMessage.value.recipient,
      body: newMessage.value.body
    }
  ])

  if (!error) {
    composeDialog.value = false
    newMessage.value = { recipient: '', body: '' }
  }
}

const filteredMessages = computed(() =>
  messages.value.filter((m) =>
    m.sender_name.toLowerCase().includes(search.value.toLowerCase())
  )
)

const formatTime = (dt) => new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

onMounted(() => {
  fetchMessages()

  supabase
    .channel('public:messages')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
      messages.value.unshift(payload.new)
    })
    .subscribe()
})
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
          <v-btn icon @click="messageDialog = true"><v-icon>mdi-chat</v-icon></v-btn>
          <v-btn icon><v-icon>mdi-bell</v-icon></v-btn>
          <v-btn :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" slim @click="toggleTheme" />
          <v-avatar size="30"><v-img src="public/hee.jpg" /></v-avatar>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-dialog v-model="modelValue" fullscreen transition="dialog-bottom-transition">
      <v-card class="pa-4" style="background: linear-gradient(to right, #cbd5e1, #94a3b8);">
        <!-- Header Search Bar -->
        <v-row class="align-center mb-4">
          <v-col cols="12" md="8">
            <v-text-field v-model="search" rounded density="comfortable" prepend-inner-icon="mdi-magnify"
              placeholder="Search Messages" hide-details>
              <template #prepend>
                <v-btn icon flat @click="messageDialog = false">
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <!-- Message List -->
          <v-col cols="12" md="8">
            <v-sheet class="pa-4 rounded-xl" elevation="6" style="background-color: white;">
              <template v-if="filteredMessages.length > 0">
                <v-list>
                  <v-list-item v-for="(message, index) in filteredMessages" :key="index" class="rounded-lg mb-2">
                    <v-list-item-avatar>
                      <v-img :src="message.avatar || fallbackAvatar" />
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

          <!-- Actions -->
          <v-col cols="12" md="4" class="d-flex flex-column align-center justify-start">
            <v-card class="pa-4 mt-6" rounded="xl" elevation="8" width="250">
              <v-btn block color="primary" class="mb-3" prepend-icon="mdi-pencil" @click="composeDialog = true">
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
          </v-col>
        </v-row>

        <!-- Compose Modal -->
        <v-dialog v-model="composeDialog" max-width="500">
          <v-card>
            <v-card-title>New Message</v-card-title>
            <v-card-text>
              <v-text-field v-model="newMessage.recipient" label="To" />
              <v-textarea v-model="newMessage.body" label="Message" auto-grow rows="4" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text @click="composeDialog = false">Cancel</v-btn>
              <v-btn color="primary" @click="sendMessage">Send</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-dialog>




  </v-app>
</template>
