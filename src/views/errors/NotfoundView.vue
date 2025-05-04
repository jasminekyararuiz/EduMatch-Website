<script setup>
import { onMounted, ref } from 'vue'
import { useDisplay } from 'vuetify'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthUserStore } from '@/stores/AuthUser'

// Utilize pre-defined vue functions
const { mobile } = useDisplay()

// Use Pinia Store
const authStore = useAuthUserStore()
console.log(authStore.user)

// Load Variables
const isLoggedIn = ref(false)
const isDrawerVisible = ref(mobile.value ? false : true)

// Load Functions during component rendering
onMounted(async () => {
  isLoggedIn.value = await authStore.isAuthenticated()
})
</script>

<template>
  <AppLayout
    :is-with-app-bar-nav-icon="isLoggedIn"
    @is-drawer-visible="isDrawerVisible = !isDrawerVisible"
  >
    <template #navigation v-if="isLoggedIn">
      <SideNavigation :is-drawer-visible="isDrawerVisible"></SideNavigation>
    </template>

    <template #content>
      <v-container>
        <v-row>
          <v-col class="mx-auto mt-16 text-center" cols="12" lg="4">
            <h1 class="text-h1 font-weight-black text-blue-darken-4">404</h1>
            <h2 class="text-h2 font-weight-black mb-2">Page Not Found</h2>

            <p class="text-subtitle-1 font-weight-bold mb-4">Page does not exist.</p>

            <v-btn class="mt-2" color="blue-darken-4" prepend-icon="mdi-home" to="/">
              Back to {{ isLoggedIn ? 'LandingPage' : 'Homepage' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>
