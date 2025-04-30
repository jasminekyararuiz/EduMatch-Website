<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/utils/supabase'

const activeTab = ref('best')
const infoDialogTutor = ref(null)
const bookDialogTutor = ref(null)
const tutors = ref([])
const loading = ref(false) // ✅ You forgot to declare this

// Fetch tutors from Supabase
const fetchTutors = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('tutors')
    .select('*')
    .order('created_at', { ascending: false })

  console.log('Fetched data:', data)
  console.log('Fetch error:', error)

  if (error) {
    console.error('Error fetching tutors:', error.message)
  } else {
    tutors.value = data
  }

  loading.value = false
}


// Computed property for sorted tutors based on active tab
const sortedTutors = computed(() => {
  if (!tutors.value || tutors.value.length === 0) return []

  if (activeTab.value === 'recent') {
    return [...tutors.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  } else if (activeTab.value === 'popular') {
    return [...tutors.value].sort((a, b) => (b.rating || 0) - (a.rating || 0))
  }

  // Default: Best Match (just return as-is for now)
  return tutors.value
})

onMounted(() => {
  fetchTutors()
})

const openInfoDialog = (tutor) => {
  infoDialogTutor.value = tutor
}

const closeInfoDialog = () => {
  infoDialogTutor.value = null
}

const openBookDialog = (tutor) => {
  bookDialogTutor.value = tutor
}

const closeBookDialog = () => {
  bookDialogTutor.value = null
}
// Confirm booking handler
const confirmBooking = () => {
  // You can later insert a booking record into Supabase here
  closeBookDialog()
  successDialog.value = true
}
const successDialog = ref(false)
const closeSuccessDialog = () => {
  successDialog.value = false
}

</script>


<template>
    <v-app>
      <v-main>
        <v-container fluid class="mt-0 pt-0 py-10 gradient-card">
          <div class="d-flex" style="gap:16px; height:calc(100vh - 100px);">
            <!-- FILTER SIDEBAR -->
            <v-col cols="12" md="3">
              <v-card elevation="2" class="pa-4 mt-3 filter-sidebar">
                <h4 class="mb-4 font-weight-bold">Filter by:</h4>
                <v-divider class="my-4" />
                <!-- You can add filter components here -->
              </v-card>
            </v-col>
  
            <!-- TUTOR LIST -->
            <v-col cols="12" md="9" class="overflow-y-auto" style="max-height:calc(100vh - 20px);">
              <v-card elevation="2" class="pa-4 mt-3" rounded="lg" color="#f5f5f5">
                <!-- TAB TOGGLE -->
                <v-card elevation="1" class="mb-4" rounded="lg" color="#ffffff">
                  <v-btn-toggle v-model="activeTab" rounded group>
                    <v-btn value="best" :class="{ 'active-tab': activeTab === 'best' }">Best Match</v-btn>
                    <v-btn value="recent" :class="{ 'active-tab': activeTab === 'recent' }">Most Recent</v-btn>
                    <v-btn value="popular" :class="{ 'active-tab': activeTab === 'popular' }">Popular Tutor</v-btn>
                  </v-btn-toggle>
                </v-card>
  
                <!-- LOADING OR EMPTY STATE -->
                <div v-if="sortedTutors.length === 0" class="text-center py-10" style="color:black">
                  No tutors found or data not loaded yet.
                </div>
  
                <!-- TUTOR CARDS -->
                <v-row v-else class="pa-2" style="row-gap:18px;">
                  <v-col
                    v-for="(tutor, i) in sortedTutors"
                    :key="i"
                    cols="12"
                    sm="4"
                    md="4"
                    lg="4"
                    class="d-flex"
                  >
                    <v-card elevation="3" class="pa-3 w-100" rounded="lg" color="#CFD8DC">
                      <v-img :src="tutor.avatar_url || 'https://via.placeholder.com/400'" height="130px" class="mb-2" cover />
                      <h5 class="font-weight-bold mb-2" style="font-size:14px">{{ tutor.name }}</h5>
                      <p style="font-size:12px" class="mb-1">Major: {{ tutor.subjects }}</p>
                      <p style="font-size:12px" class="mb-1">Time: {{ tutor.time_from }} - {{ tutor.time_to }}</p>
                      <p style="font-size:12px" class="mb-2">Location: {{ tutor.municipality }}, {{ tutor.province }}</p>
                      <div class="d-flex justify-center" style="gap:6px">
                        <v-btn color="primary" size="x-small" @click="openInfoDialog(tutor)">
                          Read More <v-icon size="14">mdi-arrow-right-bold</v-icon>
                        </v-btn>
                        <v-btn color="deep-purple-accent-4" size="x-small" @click="openBookDialog(tutor)">
                          Book Tutor <v-icon size="14">mdi-book-plus-multiple-outline</v-icon>
                        </v-btn>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </div>
        </v-container>
  
<!-- BOOKING DIALOG -->
<v-dialog v-model="bookDialogTutor" max-width="400px">
  <v-card v-if="bookDialogTutor">
    <v-card-title class="headline"></v-card-title>

    <v-card-text class="text-center">
      <p id="confirm">Are you sure you want to book <strong>{{ bookDialogTutor.name }}</strong>?</p>
    </v-card-text>

    <v-card-actions class="justify-center">
      <v-btn color="red darken-1" dark class="px-6 py-3" @click="closeBookDialog">
        Cancel
      </v-btn>

      <v-btn color="blue darken-1" dark class="ml-4 px-6 py-3" @click="confirmBooking">
        Confirm Booking
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<!-- SUCCESS DIALOG -->
<v-dialog v-model="successDialog" max-width="360px">
  <v-card elevation="10" class="overflow-hidden" style="border-radius: 20px; position: relative;">
    <!-- Top white section -->
    <div class="text-center pt-6 pb-10" style="background-color: #ECEFF1; position: relative;">
      <h2 style="color: #37474F;">Success!</h2>

      <!-- Floating Circle with Icon -->
        <v-icon class="successicon" color="#1A237E" size="50">mdi-check</v-icon>
    </div>

    <!-- Blue middle section -->
    <div class="text-center pt-13 pb-10 middle" style="background-color:#1A237E;">
      <p class="mb-5 mt-3" style="color: whitesmoke; font-size: 15px;">
        Your learning journey starts now.<br>
        Thank you for choosing <strong>EduMatch</strong>.
      </p>
    </div>

    <!-- Button section -->
    <v-card-actions class="justify-center" style="background-color: #ECEFF1;">
      <v-btn color="red darken-1" variant="text" class="mt-2 mb-4" @click="closeSuccessDialog"
        style="font-weight: bold;">
        CONTINUE
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>



        <!-- INFO DIALOG -->
        <v-dialog v-model="infoDialogTutor" max-width="450px">
          <v-card v-if="infoDialogTutor" color="#CFD8DC" elevation="3" rounded="lg">
            <v-card-text class="pt-6">
              <v-img :src="infoDialogTutor.avatar_url || 'https://via.placeholder.com/400'" height="250px" cover />
              <div class="text-center mt-4">
                <h3 class="font-weight-bold mb-2">{{ infoDialogTutor.name }}</h3>
              </div>
              <div id="def" style="padding: 0 16px;">
                <p><strong>Gender:</strong> {{ infoDialogTutor.gender }}</p>
                <p><strong>Subjects:</strong> {{ infoDialogTutor.subjects }}</p>
                <p><strong>Time:</strong> {{ infoDialogTutor.time_from }} - {{ infoDialogTutor.time_to }}</p>
                <p><strong>Mode:</strong> {{ infoDialogTutor.teaching_mode }}</p>
                <p><strong>Rate:</strong> ₱{{ infoDialogTutor.full_rate }}</p>
                <p><strong>Location:</strong> {{ infoDialogTutor.municipality }}, {{ infoDialogTutor.province }}</p>
                <p><strong>About:</strong> {{ infoDialogTutor.about_me }}</p>
                <p v-if="infoDialogTutor.portfolio_url">
                  <strong>Portfolio:</strong>
                  <a :href="infoDialogTutor.portfolio_url" target="_blank">View Portfolio</a>
                </p>
              </div>
            </v-card-text>
            <v-card-actions class="justify-center pb-4">
              <v-btn color="red darken-1" class="ma-2" @click="closeInfoDialog">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-main>
    </v-app>
  </template>

<style scoped>
.active-tab {
  background-color: #6200ea;
  color: white;
  font-weight: bold;
}

.filter-sidebar {
  position: sticky;
  top: 90px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  background-color: #172e46;
  border-radius: 16px;
  padding: 10px;
  color: white;
}

.gradient-card {
  background: linear-gradient(135deg, #ffffff, #dfe7fd, #fff7f7);
  color: white;
  height: 900px;
}

#def {
  font-size: 14px;
}

.successicon {

    background-color: #FAFAFA;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 50%;
        transform: translateX(-50%) translateY(50%);
        bottom: 0;
        z-index: 10;
}
</style>

