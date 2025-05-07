<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import ProfileHeader from '@/components/layout/ProfileHeader.vue'

// === Theme Toggle ===
const theme = ref('light')
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// === Auth: Get logged-in user ===
const user = ref(null)

onMounted(async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  user.value = currentUser

  if (currentUser) {
    fetchTutors()
  } else {
    console.warn('User not logged in. Booking disabled.')
  }
})

// === Dialog & Tab Control ===
const activeTab = ref('best')
const infoDialogTutor = ref(null)
const bookDialogTutor = ref(null)
const successDialog = ref(false)
const bookDialogVisible = ref(false)        // controls dialog visibility

// === Tutors Data ===
const tutors = ref([])
const loading = ref(false)

// === Filters ===
const filters = ref({
  gender: { male: false, female: false },
  subjects: [],
  dates: [],
  mode: [],
  location: '',
  rate: null
})

// === Utility: Format Date ===
const formatDate = (month, day, year) => {
  if (!month || !day || !year) return 'N/A'
  const date = new Date(`${month} ${day}, ${year}`)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
const formatTime12Hour = (time) => {
  if (!time || typeof time !== 'string' || !time.includes(':')) return 'N/A';

  const [hour, minute] = time.split(':');
  const h = parseInt(hour);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 || 12;

  return `${displayHour}:${minute} ${ampm}`;
};


// === Fetch Tutors ===
const fetchTutors = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('forms')
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

// === Unique Filter Data ===
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

// === Sorted & Filtered Tutors ===
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

// === Displayed Tutors by Tab ===
const isToday = (dateString) => {
  const inputDate = new Date(dateString)
  const today = new Date()
  return (
    inputDate.getDate() === today.getDate() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getFullYear() === today.getFullYear()
  )
}

const displayedTutors = computed(() => {
  if (activeTab.value === 'recent') {
    return sortedTutors.value.filter(tutor => isToday(tutor.created_at))
  }

  return [...sortedTutors.value].sort((a, b) => {
    const nameA = a.name?.toLowerCase() || ''
    const nameB = b.name?.toLowerCase() || ''
    return nameA.localeCompare(nameB)
  })
})

// === Dialog Controls ===
const openInfoDialog = (tutor) => {
  infoDialogTutor.value = tutor
}

const closeInfoDialog = () => {
  infoDialogTutor.value = null
}

const openBookDialog = (tutor) => {
  bookDialogTutor.value = tutor
  bookDialogVisible.value = true
}

const closeBookDialog = () => {
  bookDialogVisible.value = false
  bookDialogTutor.value = null
}

const closeSuccessDialog = () => {
  successDialog.value = false
}

// === Confirm Booking ===
const confirmBooking = async () => {
  if (!bookDialogTutor.value || !user.value) return

  const tutor = bookDialogTutor.value
  const learnerId = user.value.id

  // Use the actual field name where tutor's ID is stored
  const tutorId = tutor.user_id || tutor.tutor_id

  if (!tutorId) {
    console.error('Missing tutor ID in form data')
    return
  }

  const selectedSubject = Array.isArray(tutor.subjects)
    ? tutor.subjects[0]
    : tutor.subjects || 'General'

  const selectedDate = tutor.formattedPreferredDate || new Date().toISOString().split('T')[0]
  const selectedTime = tutor.preferred_time || '08:00'
  const selectedMode = tutor.teaching_mode || 'Online'

  const { error } = await supabase.from('sessions').insert([
    {
      tutor_id: tutorId,
      learner_id: learnerId,
      subjects: selectedSubject,
      session_date: selectedDate,
      session_mode: selectedMode,
      status: 'successful',
    },
  ])

  if (error) {
    console.error('Booking failed:', error.message)
    return
  }

  closeBookDialog()
  successDialog.value = true
}

</script>



<template>
  <v-app :theme="theme">
    <!-- NAVBAR -->
    <v-app-bar :color="theme === 'light' ? 'indigo-darken-4' : 'grey-darken-4'" class="px-3">
      <v-row align="center" no-gutters class="w-100">
        <v-col cols="8" class="d-flex align-center">
          <v-img src="/Edumatch_logo.png" max-width="60" class="mr-2" />
          <span class="text-h6 font-weight-bold">
            <b>Edu</b><span class="text-cyan-darken-1"><b>Match</b></span>
          </span>
        </v-col>
        <v-col cols="4" class="d-flex justify-end align-center">
          <v-btn :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" slim @click="toggleTheme" />
          <ProfileHeader></ProfileHeader>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-main>
      <v-container fluid class="mt-0 pt-0 py-10 ">
        <div class="d-flex" style="gap:16px; height:calc(100vh - 100px);">
          <v-col cols="12" md="3" class="filter-sidebar">
            <v-card :color="theme === 'light' ? '#172e46' : 'grey-darken-4'" elevation="2" class="pa-4 mt-3"
              rounded="xl">
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
                    <v-autocomplete v-model="filters.subjects" :items="uniqueSubjects" label="Select subjects" chips
                      multiple clearable dense hide-details />
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Preferred Date Filter -->
                <v-expansion-panel>
                  <v-expansion-panel-title>Preferred Date</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-autocomplete v-model="filters.dates" :items="uniqueDates" label="Select preferred dates" chips
                      multiple clearable dense hide-details />

                  </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Learning Mode Filter -->
                <v-expansion-panel>
                  <v-expansion-panel-title>Learning Mode</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-checkbox v-for="mode in uniqueModes" :key="mode" :label="mode" :value="mode"
                      v-model="filters.mode" dense hide-details />
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Location Filter -->
                <v-expansion-panel>
                  <v-expansion-panel-title>Location</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-text-field v-model="filters.location" label="Enter location" dense
                      prepend-inner-icon="mdi-map-marker" hide-details />
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Rate Filter -->
                <v-expansion-panel>
                  <v-expansion-panel-title>Rate</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-slider v-model="filters.rate" :max="maxRate" :step="10" label="Max Hourly Rate"
                      thumb-label="always" dense hide-details />
                  </v-expansion-panel-text>
                </v-expansion-panel>

              </v-expansion-panels>
            </v-card>
            <!-- FIND TUTOR / DASHBOARD CARD -->
            <v-card class="mt-10 px-3 py-5 text-center" rounded="lg"
            :color="theme === 'light' ? 'indigo-darken-4' : 'grey-darken-3'">
            <div class="text-body-2 font-italic mb-3 text-caption">"I am an Edumatch Learner"</div>

              <v-btn class="text-grey-darken-1 mb-2" rounded="xl" density="compact">
                <b>FIND TUTOR</b>
              </v-btn>
              <RouterLink to="/learnerdashboard" class="text-decoration-none">
                <h4 class="text-white mt-2">DASHBOARD</h4>
              </RouterLink>
            </v-card>
          </v-col>


          <!-- TUTOR LIST -->
          <v-col cols="12" md="9" class="overflow-y-auto" style="max-height:calc(100vh - 20px);">
            <v-card :color="theme === 'light' ? 'grey-lighten-3' : 'grey-darken-4'" elevation="2" class="pa-4 mt-3"
              rounded="lg">
              <!-- TAB TOGGLE -->
              <v-card elevation="1" class="mb-4" rounded="lg">
                <v-btn-toggle v-model="activeTab" rounded group>
                  <v-btn value="best" :class="{ 'active-tab': activeTab === 'best' }">Best Match</v-btn>
                  <v-btn value="recent" :class="{ 'active-tab': activeTab === 'recent' }">Most Recent</v-btn>
                </v-btn-toggle>
              </v-card>

              <!-- LOADING OR EMPTY STATE -->
              <div v-if="sortedTutors.length === 0" class="text-center py-10" style="color:black">
                No tutors found or data not loaded yet.
              </div>

              <!-- TUTOR CARDS -->
              <v-row v-else class="pa-2" style="row-gap:18px;">
                <v-col v-for="(tutor, i) in displayedTutors" :key="i" cols="12" sm="4" md="4" lg="4" class="d-flex">
                  <v-card :color="theme === 'light' ? '#CFD8DC' : 'grey-darken-2'" elevation="3" class="pa-3 w-100"
                    rounded="lg">
                    <v-img :src="tutor.avatar_url || 'https://via.placeholder.com/400'" height="130px" class="mb-2"
                      cover />
                    <h5 class="font-weight-bold mb-2" style="font-size:14px">{{ tutor.name }}</h5>
                    <p style="font-size:12px" class="mb-1">Major: {{ tutor.subjects }}</p>
                    <p style="font-size:12px" class="mb-1">Time: {{ formatTime12Hour(tutor.time_from) }} - {{
                      formatTime12Hour(tutor.time_to) }}</p>
                    <p style="font-size:12px" class="mb-2">Location: {{ tutor.municipality }}, {{ tutor.province }}
                    </p>
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
      <v-dialog v-model="bookDialogVisible" max-width="400px">
        <v-card>
          <v-card-title class="headline text-center">Confirm Booking</v-card-title>

          <v-card-text class="text-center">
            <p id="confirm">
              Are you sure you want to book <strong>{{ bookDialogTutor?.name }}</strong>?
            </p>
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
      <v-dialog v-model="successDialog" max-width="400px">
  <v-card elevation="8" class="rounded-xl overflow-hidden">
    
    <!-- Header -->
    <v-sheet class="py-6 text-center" color="grey-lighten-3">
      <v-icon size="64" color="success">mdi-check-circle</v-icon>
      <h2 class="mt-3 text-h6 font-weight-bold text-grey-darken-3">Success!</h2>
    </v-sheet>

    <!-- Body -->
    <v-sheet class="py-8 px-4 text-center" color="indigo-darken-4">
      <p class="text-white text-body-1">
        Your learning journey starts now.<br />
        Thank you for choosing <strong>EduMatch</strong>.
      </p>
    </v-sheet>

    <!-- Footer -->
    <v-card-actions class="justify-center py-4" color="grey-lighten-3">
      <v-btn color="indigo-darken-4" class="text-white font-weight-bold px-6" @click="closeSuccessDialog">
        CONTINUE
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>

  </v-card>
</v-dialog>

      <!-- BOOKING DIALOG -->




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
              <p><strong>Time:</strong> {{ formatTime12Hour(infoDialogTutor.time_from) }} - {{
                formatTime12Hour(infoDialogTutor.time_to) }}</p>
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
            <v-img class="mx-auto mb-2 mt-5 px-5" src="/Edumatch_logo.png" width="30%">
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


</style>
