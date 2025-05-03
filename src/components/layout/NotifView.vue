<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/utils/supabase'

// Props & emits for v-model
const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])

// Theme
const theme = ref('light')
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// State
const notifications = ref([])
const search = ref('')
const fallbackIcon = 'mdi-bell-ring'

// Fetch notifications
const fetchNotifications = async () => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })

  if (!error) notifications.value = data
}

// Real-time subscription
onMounted(() => {
  fetchNotifications()

  supabase
    .channel('public:notifications')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
      notifications.value.unshift(payload.new)
    })
    .subscribe()
})

// Filtered notifications
const filteredNotifications = computed(() =>
  notifications.value.filter((n) =>
    n.title.toLowerCase().includes(search.value.toLowerCase()) ||
    n.body.toLowerCase().includes(search.value.toLowerCase())
  )
)

const formatTime = (dt) => new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
</script>

<template>
  <v-dialog v-model="props.modelValue" fullscreen transition="dialog-bottom-transition"
    @update:modelValue="val => emit('update:modelValue', val)">
    <v-card class="pa-4" style="background: linear-gradient(to right, #f1f5f9, #e2e8f0);">
      <!-- Header -->
      <v-row class="align-center mb-4">
        <v-col cols="12" md="8">
          <v-text-field v-model="search" rounded density="comfortable" prepend-inner-icon="mdi-magnify"
            placeholder="Search Notifications" hide-details>
            <template #prepend>
              <v-btn icon flat @click="emit('update:modelValue', false)">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <!-- Notifications List -->
      <v-sheet class="pa-4 rounded-xl" elevation="6" style="background-color: white;">
        <template v-if="filteredNotifications.length > 0">
          <v-list>
            <v-list-item v-for="(notif, index) in filteredNotifications" :key="index" class="rounded-lg mb-2">
              <v-list-item-icon>
                <v-icon color="primary">{{ notif.icon || fallbackIcon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">{{ notif.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ notif.body }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action-text class="text-grey">
                {{ formatTime(notif.created_at) }}
              </v-list-item-action-text>
            </v-list-item>
          </v-list>
        </template>
        <template v-else>
          <div class="text-center py-10">
            <v-icon size="56" color="grey">mdi-bell-off</v-icon>
            <h3 class="mt-2">No notifications yet</h3>
            <p>You're all caught up for now.</p>
          </div>
        </template>
      </v-sheet>
    </v-card>
  </v-dialog>
</template>
