<script setup>
import { ref, computed } from 'vue'

const theme = ref('light')
const activeTab = ref('best')
const triggerSubjectSearch = ref(false)

// Split dialogs:
const infoDialogTutor = ref(null)
const bookDialogTutor = ref(null)

// Dialog states
const bookDialogOpen = ref(false);
const successDialog = ref(false);

// Close booking dialog
function closeBookDialog() {
  bookDialogTutor.value = false;
}

// Confirm booking and open success dialog
function confirmBooking() {
  bookDialogTutor.value = false;
  successDialog.value = true;
}

// Close success dialog
function closeSuccessDialog() {
  successDialog.value = false;
}

function openInfoDialog(tutor) { infoDialogTutor.value = tutor }
function closeInfoDialog() { infoDialogTutor.value = null }

function openBookDialog(tutor) { bookDialogTutor.value = tutor }


// “Others” free‑text inputs
const subjectOther = ref('')
const timeOther = ref('')

// Full filter state
const filters = ref({
  gender: { male: false, female: false },
  subjects: { english: false, math: false, science: false, filipino: false, abstract: false, physics: false, programming: false },
  time: { one: false, two: false, three: false, four: false, five: false },
  mode: { f2f: false, online: false },
  area: ''
})

// Tutor data
// (In a real app, this would be fetched from an API)
// For this example, we are using a static array of objects
// to simulate the tutor data
// Each object represents a tutor with various properties
const allTutors = [
  { name: 'Adelle Reyes', gender: 'female', major: 'English', time: '2 hours', mode: 'online', image: 'public/adelle.jpg', popularity: 3, addedDate: '2025-04-18', area: 'Manila' },
  { name: 'Seve Mallari', gender: 'male', major: 'Mathematics', time: '1 hour', mode: 'f2f', image: 'public/heedeuhdjsa.jpg', popularity: 5, addedDate: '2025-04-17', area: 'Cebu' },
  { name: 'Joy Bautista', gender: 'female', major: 'Accounting', time: '2 hours', mode: 'online', image: 'public/kathryn.jpg', popularity: 4, addedDate: '2025-04-16', area: 'Cagayan de Oro' },
  { name: 'Blythe Castro', gender: 'female', major: 'English', time: '3 hours', mode: 'f2f', image: 'public/blytheee.jpg', popularity: 2, addedDate: '2025-04-15', area: 'Leyte' },
  { name: 'Bingo Garcia', gender: 'male', major: 'Filipino', time: '1 hour', mode: 'online', image: 'public/donny.jpg', popularity: 1, addedDate: '2025-04-14', area: 'Palawan' },
  { name: 'Sahaya Ramirez', gender: 'female', major: 'Science', time: '2 hours', mode: 'f2f', image: 'public/jennieeee.jpg', popularity: 3, addedDate: '2025-04-13', area: 'Davao' },
  { name: 'Ares Riego', gender: 'male', major: 'Abstract', time: '4 hours', mode: 'f2f', image: 'public/leejomgsukk.jpg', popularity: 1, addedDate: '2025-04-13', area: 'Cebu' },
  { name: 'Hades Santos', gender: 'male', major: 'Programming', time: '8 hours', mode: 'f2f', image: 'public/sunjae.jpg', popularity: 3, addedDate: '2025-04-13', area: 'Butuan' },
  { name: 'Hera Lee', gender: 'female', major: 'Physics', time: '2 hours', mode: 'online', image: 'public/mongayoun.jpg', popularity: 4, addedDate: '2025-04-13', area: 'Buenavista' },
]

// Computed filtered list
const filteredTutors = computed(() => {
  // re-run when “Search Subjects” clicked
  triggerSubjectSearch.value

  return allTutors.filter(t => {
    const genderOk =
      (!filters.value.gender.male && !filters.value.gender.female) ||
      (filters.value.gender.male && t.gender === 'male') ||
      (filters.value.gender.female && t.gender === 'female')

    const subjOk =
      !Object.values(filters.value.subjects).includes(true) ||
      filters.value.subjects[t.major.toLowerCase()]

    const otherSubjOk =
      subjectOther.value.trim() === '' ||
      t.major.toLowerCase().includes(subjectOther.value.toLowerCase())

    const timeOk =
      !Object.values(filters.value.time).includes(true) ||
      (filters.value.time.one && t.time === '1 hour') ||
      (filters.value.time.two && t.time === '2 hours') ||
      (filters.value.time.three && t.time === '3 hours') ||
      (filters.value.time.four && t.time === '4 hours') ||
      (filters.value.time.five && t.time === '5 hours')

    const otherTimeOk =
      timeOther.value.trim() === '' ||
      t.time.toLowerCase().includes(timeOther.value.toLowerCase())

    const modeOk =
      (!filters.value.mode.f2f && !filters.value.mode.online) ||
      (filters.value.mode.f2f && t.mode === 'f2f') ||
      (filters.value.mode.online && t.mode === 'online')

    const areaOk =
      filters.value.area.trim() === '' ||
      t.area.toLowerCase().includes(filters.value.area.toLowerCase())

    return genderOk && subjOk && otherSubjOk && timeOk && otherTimeOk && modeOk && areaOk
  })
})

// Computed sorted list
const sortedTutors = computed(() => {
  if (activeTab.value === 'best' || activeTab.value === 'popular') {
    return [...filteredTutors.value].sort((a, b) => b.popularity - a.popularity)
  }
  if (activeTab.value === 'recent') {
    return [...filteredTutors.value].sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
  }
  return filteredTutors.value
})


const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

</script>

<template>
  <v-app :theme="theme">
    <!-- NAVBAR -->
    <v-app-bar :color="theme === 'light' ? 'indigo-darken-4' : 'grey-darken-2'" class="px-3">
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

    <!-- MAIN CONTENT -->
    <v-main>
      <v-container fluid class="mt-0 pt-0 py-10 gradient-card">
        <div class="d-flex" style="gap:16px; height:calc(100vh - 100px);">
          <!-- FILTER SIDEBAR -->
          <v-col cols="12" md="3">
            <v-card elevation="2" class="pa-4 mt-3 filter-sidebar">
              <h4 class="mb-4 font-weight-bold">Filter by:</h4>
              <v-divider class="my-4" />
              <v-expansion-panels accordion>
                <!-- Gender -->
                <v-expansion-panel>
                  <v-expansion-panel-title>Gender</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-checkbox label="Male" v-model="filters.gender.male" dense />
                    <v-checkbox label="Female" v-model="filters.gender.female" dense />
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Subject of Interest -->
                <v-expansion-panel>
                  <v-expansion-panel-title>Subject of Interest</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-checkbox label="English" v-model="filters.subjects.english" dense />
                    <v-checkbox label="Mathematics" v-model="filters.subjects.math" dense />
                    <v-checkbox label="Science" v-model="filters.subjects.science" dense />
                    <v-checkbox label="Filipino" v-model="filters.subjects.filipino" dense />
                    <v-checkbox label="Abstract" v-model="filters.subjects.abstract" dense />
                    <v-checkbox label="Physics" v-model="filters.subjects.physics" dense />
                    <v-checkbox label="Programming" v-model="filters.subjects.programming" dense />
                    <v-text-field v-model="subjectOther" dense hide-details placeholder="Others"
                      prepend-inner-icon="mdi-magnify" class="mt-2" />
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Preferred Time -->
                <v-expansion-panel>
                  <v-expansion-panel-title>Preferred Time</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-checkbox label="1 hour" v-model="filters.time.one" dense />
                    <v-checkbox label="2 hours" v-model="filters.time.two" dense />
                    <v-checkbox label="3 hours" v-model="filters.time.three" dense />
                    <v-checkbox label="4 hours" v-model="filters.time.four" dense />
                    <v-checkbox label="5 hours" v-model="filters.time.five" dense />
                    <v-text-field v-model="timeOther" dense hide-details placeholder="Others"
                      prepend-inner-icon="mdi-timer" class="mt-2" />
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Learning Mode -->
                <v-expansion-panel>
                  <v-expansion-panel-title>Learning Mode</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-checkbox label="Face-to-Face" v-model="filters.mode.f2f" dense />
                    <v-checkbox label="Online" v-model="filters.mode.online" dense />
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Area -->
                <v-expansion-panel>
                  <v-expansion-panel-title>Area</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-text-field v-model="filters.area" dense hide-details label="Enter location"
                      prepend-inner-icon="mdi-map-marker" />
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
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

              <!-- TUTOR CARDS -->
              <v-row class="pa-2" style="row-gap:18px;">
                <v-col v-for="(tutor, i) in sortedTutors" :key="i" cols="12" sm="4" md="4" lg="4" class="d-flex">
                  <v-card elevation="3" class="pa-3 w-100" rounded="lg" color="#CFD8DC">
                    <v-img :src="tutor.image" height="130px" class="mb-2" cover />
                    <h5 class="font-weight-bold mb-2" style="font-size:14px">{{ tutor.name }}</h5>
                    <p style="font-size:12px" class="mb-1">Major: {{ tutor.major }}</p>
                    <p style="font-size:12px" class="mb-1">Time: {{ tutor.time }}</p>
                    <p style="font-size:12px" class="mb-2">Location: {{ tutor.area }}</p>
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
              <span class="text-blue-lighten-2"><b>Edu</b></span>
              <span class="text-blue-darken-4"><b>Match</b></span>
            </span>
            <p class="text-subtitle-2 text-grey-darken-1"><i>Turn Knowledge Into Opportunity</i></p>
          </v-col>

          <!-- INFO DIALOG -->
          <v-dialog v-model="infoDialogTutor" max-width="400px" class="pa-0">
            <v-card v-if="infoDialogTutor" color="#CFD8DC" elevation="3" rounded="lg" class="d-flex flex-column"
              style="max-height: 90vh; width:450px;">
              <v-card-text class="pt-6">
                <!-- Image full‑width -->
                <v-img :src="infoDialogTutor.image" height="250px" cover />

                <!-- Name underneath, centered -->
                <div class="text-center mt-4">
                  <h3 class="font-weight-bold mb-2">{{ infoDialogTutor.name }}</h3>
                </div>

                <!-- Details -->
                <div id="def" style="padding: 0 16px;" class=""> <br>
                  <p><strong>Major:</strong> {{ infoDialogTutor.major }}</p>
                  <p><strong>Time:</strong> {{ infoDialogTutor.time }}</p>
                  <p><strong>Location:</strong> {{ infoDialogTutor.area }}</p>
                  <p><strong>Mode:</strong>
                    {{ infoDialogTutor.mode === 'f2f' ? 'Face‑to‑Face' : 'Online' }}
                  </p>
                  <p><strong>Gender:</strong>
                    {{ infoDialogTutor.gender === 'male' ? 'Male' : 'Female' }}
                  </p>
                </div>
              </v-card-text>

              <!-- Close Button inside Card Actions -->
              <v-card-actions class="justify-center pb-4">
                <v-btn color="red darken-1" class="ma-2" @click="closeInfoDialog">
                  Close
                </v-btn>
              </v-card-actions>


            </v-card>
          </v-dialog>

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
                <h2 style="color: #37474F ;">Success!</h2>

                <!-- Floating Circle with Icon -->
                <div style="
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
        ">
                  <v-icon color="#1A237E" size="50">mdi-check</v-icon>
                </div>
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
                  <v-icon color="blue" size="18" class="me-2">mdi-facebook</v-icon> Cristina Berwan
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

#namepop {
  font-size: 21px;
  font-weight: bold;
  color: #3c118d;
  font-family: 'Times New Roman', Times, serif;
}

#def {
  font-size: 14px;
}

.custom-button {
  font-size: 13px;
  padding: 12px 18px;
}

#middle {
  color: #37474F;
}
</style>
