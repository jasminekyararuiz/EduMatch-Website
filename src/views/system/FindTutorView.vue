<script setup>
import { ref, computed } from 'vue'

const theme = ref('light')
const activeTab = ref('best')

const onClick = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const filters = ref({
  gender: { male: false, female: false },
  subjects: {
    english: false,
    math: false,
    science: false,
    filipino: false,
    abstract: false,
  },
  time: { one: false, two: false, three: false, four: false, five: false },
  mode: { f2f: false, online: false },
  area: '', // NEW: Area filter
})

const allTutors = [
  {
    name: 'Adelle Reyes',
    gender: 'female',
    major: 'English',
    time: '2 hours',
    mode: 'online',
    image: 'public/adelle.jpg',
    popularity: 3,
    addedDate: '2025-04-18',
    area: 'Manila',
  },
  {
    name: 'Seve Mallari',
    gender: 'male',
    major: 'Mathematics',
    time: '1 hour',
    mode: 'f2f',
    image: 'public/heedeuhdjsa.jpg',
    popularity: 5,
    addedDate: '2025-04-17',
    area: 'Cebu',
  },
  {
    name: 'Joy Bautista',
    gender: 'female',
    major: 'Science',
    time: '2 hours',
    mode: 'online',
    image: 'public/kathryn.jpg',
    popularity: 4,
    addedDate: '2025-04-16',
    area: 'Davao',
  },
  {
    name: 'Blythe Castro',
    gender: 'female',
    major: 'English',
    time: '3 hours',
    mode: 'f2f',
    image: 'public/blytheee.jpg',
    popularity: 2,
    addedDate: '2025-04-15',
    area: 'Manila',
  },
  {
    name: 'Bingo Garcia',
    gender: 'male',
    major: 'Filipino',
    time: '1 hour',
    mode: 'online',
    image: 'public/donny.jpg',
    popularity: 1,
    addedDate: '2025-04-14',
    area: 'Cebu',
  },
  {
    name: 'Sahaya Ramirez',
    gender: 'female',
    major: 'Science',
    time: '2 hours',
    mode: 'f2f',
    image: 'public/jennieeee.jpg',
    popularity: 3,
    addedDate: '2025-04-13',
    area: 'Davao',
  },
]

const filteredTutors = computed(() => {
  return allTutors.filter((tutor) => {
    const genderFilter =
      (!filters.value.gender.male && !filters.value.gender.female) ||
      (filters.value.gender.male && tutor.gender === 'male') ||
      (filters.value.gender.female && tutor.gender === 'female')

    const subjectFilter =
      !Object.values(filters.value.subjects).includes(true) ||
      filters.value.subjects[tutor.major.toLowerCase()]

    const timeFilter =
      !Object.values(filters.value.time).includes(true) ||
      (filters.value.time.one && tutor.time === '1 hour') ||
      (filters.value.time.two && tutor.time === '2 hours') ||
      (filters.value.time.three && tutor.time === '3 hours') ||
      (filters.value.time.four && tutor.time === '4 hours') ||
      (filters.value.time.five && tutor.time === '5 hours')

    const modeFilter =
      (!filters.value.mode.f2f && !filters.value.mode.online) ||
      (filters.value.mode.f2f && tutor.mode === 'f2f') ||
      (filters.value.mode.online && tutor.mode === 'online')

    const areaFilter =
      filters.value.area.trim() === '' ||
      tutor.area.toLowerCase().includes(filters.value.area.toLowerCase())

    return genderFilter && subjectFilter && timeFilter && modeFilter && areaFilter
  })
})

const sortedTutors = computed(() => {
  if (activeTab.value === 'best' || activeTab.value === 'popular') {
    return [...filteredTutors.value].sort((a, b) => b.popularity - a.popularity)
  } else if (activeTab.value === 'recent') {
    return [...filteredTutors.value].sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
  }
  return filteredTutors.value
})
</script>

<template>
  <v-responsive>
    <v-app :theme="theme">
      <!-- NAVBAR -->
      <v-app-bar class="px-3" :color="theme === 'light' ? 'blue-lighten-3' : 'grey-darken-2'">
        <v-row align="center" no-gutters class="w-100">
          <v-col cols="8" class="d-flex align-center">
            <v-img src="/public/Edumatch_logo.png" max-width="60" class="mr-2" />
            <span class="text-h6 font-weight-bold">
              <b>Edu</b><span class="text-primary"><b>Match</b></span>
            </span>
          </v-col>
          <v-col cols="4" class="d-flex justify-end align-center">
            <v-text-field dense hide-details rounded="xl" variant="solo" density="compact" placeholder="Search"
              prepend-inner-icon="mdi-magnify" style="max-width: 220px;" />
            <v-btn icon><v-icon>mdi-chat</v-icon></v-btn>
            <v-btn icon><v-icon>mdi-bell</v-icon></v-btn>
            <v-btn :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" slim @click="onClick" />
            <v-avatar size="30"><v-img src="public/heeseung.jpg" /></v-avatar>
          </v-col>
        </v-row>
      </v-app-bar>

      <!-- MAIN -->
      <v-main>
          <v-container fluid class="mt-0 pt-0 gradient-card">
            <div style="display: flex; align-items: flex-start; gap: 16px; height: calc(100vh - 100px);">
              <!-- FILTER SIDEBAR -->
              <v-col cols="12" md="3">
                <v-card class="pa-4 mt-3 filter-sidebar" elevation="2">
                  <h4 class="mb-4 font-weight-bold">Filter by:</h4>
                  <v-divider class="my-4" />
                  <v-expansion-panels variant="accordion">
                    <v-expansion-panel>
                      <v-expansion-panel-title>Gender</v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-checkbox label="Male" v-model="filters.gender.male" dense />
                        <v-checkbox label="Female" v-model="filters.gender.female" dense />
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel>
                      <v-expansion-panel-title>Subject of Interest</v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-checkbox label="English" v-model="filters.subjects.english" dense />
                        <v-checkbox label="Mathematics" v-model="filters.subjects.math" dense />
                        <v-checkbox label="Science" v-model="filters.subjects.science" dense />
                        <v-checkbox label="Filipino" v-model="filters.subjects.filipino" dense />
                        <v-checkbox label="Abstract" v-model="filters.subjects.abstract" dense />
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel>
                      <v-expansion-panel-title>Preferred Time</v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-checkbox label="1 hour" v-model="filters.time.one" dense />
                        <v-checkbox label="2 hours" v-model="filters.time.two" dense />
                        <v-checkbox label="3 hours" v-model="filters.time.three" dense />
                        <v-checkbox label="4 hours" v-model="filters.time.four" dense />
                        <v-checkbox label="5 hours" v-model="filters.time.five" dense />
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel>
                      <v-expansion-panel-title>Learning Mode</v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-checkbox label="Face-to-Face" v-model="filters.mode.f2f" dense />
                        <v-checkbox label="Online" v-model="filters.mode.online" dense />
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel>
                      <v-expansion-panel-title>Area</v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-text-field v-model="filters.area" label="Enter location" dense hide-details
                          prepend-inner-icon="mdi-map-marker" />
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card>
              </v-col>

              <!-- TUTOR RESULTS WRAPPED INSIDE A CARD -->
              <v-col cols="12" md="9" style="overflow-y: auto; max-height: calc(100vh - 100px);">
                <!-- Outer card wrapper with bg -->
                <v-card class="pa-4 mt-3" elevation="2" rounded="lg" style="background-color: #f5f5f5;">

                  <!-- Toggle button card with bg -->
                  <v-card class="mb-4 pa-3" elevation="1" rounded="lg" style="background-color: #ffffff;">
                    <v-btn-toggle v-model="activeTab" rounded group>
                      <v-btn value="best" :class="{ 'active-tab': activeTab === 'best' }">Best Match</v-btn>
                      <v-btn value="recent" :class="{ 'active-tab': activeTab === 'recent' }">Most Recent</v-btn>
                      <v-btn value="popular" :class="{ 'active-tab': activeTab === 'popular' }">Popular Tutor</v-btn>
                    </v-btn-toggle>
                  </v-card>

                  <!-- Tutors List -->
                  <v-row class="pa-2 justify-space-between" style="row-gap: 18px;">
                    <v-col v-for="(tutor, index) in sortedTutors" :key="index" cols="12" sm="4" md="4" lg="4"
                      class="d-flex">
                      <!-- Each tutor card with bg -->
                      <v-card elevation="3" class="pa-3 w-100" rounded="lg" style="background-color: #CFD8DC;">
                        <v-img :src="tutor.image" height="130px" class="mb-2" cover />
                        <h5 class="font-weight-bold mb-2" style="font-size: 14px;">{{ tutor.name }}</h5>
                        <p class="mb-1" style="font-size: 12px;">Major: {{ tutor.major }}</p>
                        <p class="mb-1" style="font-size: 12px;">Time: {{ tutor.time }}</p>
                        <p class="mb-2" style="font-size: 12px;">Location: {{ tutor.area }}</p>
                        <div class="d-flex justify-center" style="gap: 6px;">
                          <v-btn color="primary" size="x-small" class="px-2">
                            Read More <v-icon size="14">mdi-arrow-right-bold</v-icon>
                          </v-btn>
                          <v-btn color="deep-purple-accent-4" size="x-small" class="px-2">
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

      <v-footer :color="theme === 'light' ? 'blue-lighten-5' : 'grey-darken-2'" border app>
        <span class="mx-auto">2025 - EduMatch</span>
      </v-footer>
    </v-app>
  </v-responsive>
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
  background: linear-gradient(135deg, #0129879d, #dfe7fd, #5B74B4);
  color: white;
}
</style>
