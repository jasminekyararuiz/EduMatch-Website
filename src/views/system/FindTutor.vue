<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/utils/supabase'

// Theme toggle
const theme = ref('light')
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// Utility to check if a date is today
const isToday = (dateString) => {
  const inputDate = new Date(dateString)
  const today = new Date()
  return (
    inputDate.getDate() === today.getDate() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getFullYear() === today.getFullYear()
  )
}

// This determines what tutors to display based on activeTab
const displayedTutors = computed(() => {
  if (activeTab.value === 'recent') {
    return sortedTutors.value.filter(tutor => isToday(tutor.created_at));
  }

  // Sort alphabetically by name (A-Z)
  return [...sortedTutors.value].sort((a, b) => {
    const nameA = a.name?.toLowerCase() || '';
    const nameB = b.name?.toLowerCase() || '';
    return nameA.localeCompare(nameB);
  });
});



// Dialog & tab control
const activeTab = ref('best')
const infoDialogTutor = ref(null)
const bookDialogTutor = ref(null)
const successDialog = ref(false)

// State
const tutors = ref([])
const loading = ref(false)

// Filters
const filters = ref({
  gender: { male: false, female: false },
  subjects: [],
  dates: [],
  mode: [],
  location: '',
  rate: null
})

// Format function for Preferred Date
const formatDate = (month, day, year) => {
  if (!month || !day || !year) return 'N/A'
  const date = new Date(`${month} ${day}, ${year}`)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
// Format function for time
const formatTime12Hour = (time) => {
  const [hour, minute] = time.split(':')
  const h = parseInt(hour)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const displayHour = h % 12 || 12
  return `${displayHour}:${minute} ${ampm}`
}
// Fetch tutors from Supabase
const fetchTutors = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('tutors')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tutors:', error.message)
  } else {
    tutors.value = data.map(tutor => ({
      ...tutor,
      formattedPreferredDate: formatDate(tutor.month, tutor.day, tutor.year)
    }))
  }

  loading.value = false
}

// Unique filter data
const uniqueSubjects = computed(() => {
  const allSubjects = tutors.value.flatMap(t => t.subjects || [])
  return [...new Set(allSubjects)]
})

const uniqueDates = computed(() => {
  return [...new Set(tutors.value.map(t => t.formattedPreferredDate))]
})

const uniqueModes = computed(() => {
  return [...new Set(tutors.value.map(t => t.teaching_mode))]
})

const maxRate = computed(() => {
  return Math.max(...tutors.value.map(t => Number(t.full_rate) || 0))
})

// Filtered tutors
const sortedTutors = computed(() => {
  return tutors.value.filter(tutor => {
    const genderMatch =
      (!filters.value.gender.male && !filters.value.gender.female) ||
      (filters.value.gender.male && tutor.gender === 'Male') ||
      (filters.value.gender.female && tutor.gender === 'Female')

    const subjectMatch =
      filters.value.subjects.length === 0 ||
      filters.value.subjects.some(subject => tutor.subjects?.includes(subject))

    const dateMatch =
      filters.value.dates.length === 0 ||
      filters.value.dates.includes(tutor.formattedPreferredDate)

    const modeMatch =
      filters.value.mode.length === 0 ||
      filters.value.mode.includes(tutor.teaching_mode)

    const locationMatch =
      !filters.value.location ||
      `${tutor.province}, ${tutor.municipality}`.toLowerCase().includes(filters.value.location.toLowerCase())

    const rateMatch =
      !filters.value.rate ||
      Number(tutor.full_rate) <= filters.value.rate

    return genderMatch && subjectMatch && dateMatch && modeMatch && locationMatch && rateMatch
  })
})

// Dialog controls
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

const confirmBooking = () => {
  closeBookDialog()
  successDialog.value = true
}

const closeSuccessDialog = () => {
  successDialog.value = false
}

// Load tutors on mount
onMounted(fetchTutors)
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
          <v-text-field dense hide-details rounded="xl" variant="solo" density="compact" placeholder="Search"
            prepend-inner-icon="mdi-magnify" style="max-width:220px;" />
          <v-btn icon><v-icon>mdi-chat</v-icon></v-btn>
          <v-btn icon><v-icon>mdi-bell</v-icon></v-btn>
          <v-btn :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" slim @click="toggleTheme" />
          <v-avatar size="30"><v-img src="public/hee.jpg" /></v-avatar>
        </v-col>
      </v-row>
    </v-app-bar>
      <v-main>
        <v-container fluid class="mt-0 pt-0 py-10 ">
          <div class="d-flex" style="gap:16px; height:calc(100vh - 100px);">
            <v-col cols="12" md="3" class="filter-sidebar">
  <v-card
    :color="theme === 'light' ? '#172e46' : 'grey-darken-4'"
    elevation="2"
    class="pa-4 mt-3"
    rounded="xl"
  >
    <h4 class="mb-4 font-weight-bold">Filter by:</h4>
    <v-divider class="my-4" />
    <v-expansion-panels multiple>

      <!-- Gender Filter -->
      <v-expansion-panel>
        <v-expansion-panel-title>Gender</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-checkbox label="Male" v-model="filters.gender.male" dense hide-details />
          <v-checkbox label="Female" v-model="filters.gender.female" dense hide-details />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Subject Filter with Search -->
      <v-expansion-panel>
        <v-expansion-panel-title>Subjects</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-autocomplete
            v-model="filters.subjects"
            :items="uniqueSubjects"
            label="Select subjects"
            chips
            multiple
            clearable
            dense
            hide-details
          />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Preferred Date Filter -->
      <v-expansion-panel>
        <v-expansion-panel-title>Preferred Date</v-expansion-panel-title>
        <v-expansion-panel-text>
            <v-autocomplete
  v-model="filters.dates"
  :items="uniqueDates"
  label="Select preferred dates"
  chips
  multiple
  clearable
  dense
  hide-details
/>

        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Learning Mode Filter -->
      <v-expansion-panel>
        <v-expansion-panel-title>Learning Mode</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-checkbox
            v-for="mode in uniqueModes"
            :key="mode"
            :label="mode"
            :value="mode"
            v-model="filters.mode"
            dense
            hide-details
          />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Location Filter -->
      <v-expansion-panel>
        <v-expansion-panel-title>Location</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-text-field
            v-model="filters.location"
            label="Enter location"
            dense
            prepend-inner-icon="mdi-map-marker"
            hide-details
          />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Rate Filter -->
      <v-expansion-panel>
        <v-expansion-panel-title>Rate</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-slider
            v-model="filters.rate"
            :max="maxRate"
            :step="10"
            label="Max Hourly Rate"
            thumb-label="always"
            dense
            hide-details
          />
        </v-expansion-panel-text>
      </v-expansion-panel>

    </v-expansion-panels>
  </v-card>
</v-col>
  
            <!-- TUTOR LIST -->
            <v-col cols="12" md="9" class="overflow-y-auto" style="max-height:calc(100vh - 20px);">
              <v-card
              :color="theme === 'light' ? 'grey-lighten-3' : 'grey-darken-4'"
               elevation="2" class="pa-4 mt-3" rounded="lg">
                <!-- TAB TOGGLE -->
                <v-card  
                elevation="1" class="mb-4" rounded="lg" >
                  <v-btn-toggle v-model="activeTab" rounded group>
                    <v-btn value="best" :class="{ 'active-tab': activeTab === 'best' }">Best Match</v-btn>
                    <v-btn  value="recent" :class="{ 'active-tab': activeTab === 'recent' }">Most Recent</v-btn>
                  </v-btn-toggle>
                </v-card>
  
                <!-- LOADING OR EMPTY STATE -->
                <div v-if="sortedTutors.length === 0" class="text-center py-10" style="color:black">
                  No tutors found or data not loaded yet.
                </div>
  
                <!-- TUTOR CARDS -->
                <v-row v-else class="pa-2" style="row-gap:18px;">
                  <v-col
                    v-for="(tutor, i) in displayedTutors"
                    :key="i"
                    cols="12"
                    sm="4"
                    md="4"
                    lg="4"
                    class="d-flex"
                  >
                    <v-card
                    :color="theme === 'light' ? '#CFD8DC' : 'grey-darken-2'"
                    elevation="3" class="pa-3 w-100" rounded="lg">
                      <v-img :src="tutor.avatar_url || 'https://via.placeholder.com/400'" height="130px" class="mb-2" cover />
                      <h5 class="font-weight-bold mb-2" style="font-size:14px">{{ tutor.name }}</h5>
                      <p style="font-size:12px" class="mb-1">Major: {{ tutor.subjects }}</p>
                      <p style="font-size:12px" class="mb-1">Time: {{ formatTime12Hour(tutor.time_from) }} - {{ formatTime12Hour(tutor.time_to) }}</p>
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
                <p><strong>Teaching Mode:</strong> {{ infoDialogTutor.teaching_mode }}</p>
                <p><strong>Preferred Date:</strong> {{ infoDialogTutor.formattedPreferredDate }}</p>
                <p><strong>Hourly Rate:</strong> ₱{{ infoDialogTutor.full_rate }}</p>
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

