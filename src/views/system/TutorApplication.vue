<script setup>
import { ref } from 'vue'
const theme = ref('light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const days = Array.from({ length: 31 }, (_, i) => i + 1)
const years = Array.from({ length: 11 }, (_, i) => 2025 + i)
const provinces = ['Province A', 'Province B']
const municipalities = ['Municipality A', 'Municipality B']
const barangays = ['Barangay A', 'Barangay B']

const fileInput = ref(null)
const video = ref(null)
const canvas = ref(null)
const photo = ref(null)
const isCameraActive = ref(false)
let stream = null

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    console.log('Uploaded document:', file)
  }
}

const startCamera = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true })
    if (video.value) {
      video.value.srcObject = stream
      video.value.play()
      isCameraActive.value = true
    }
  } catch (err) {
    console.error('Camera access denied or not available:', err)
  }
}

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
    stream = null
    isCameraActive.value = false
  }
}
const takePhoto = () => {
  if (!video.value || !canvas.value) return

  const context = canvas.value.getContext('2d')
  const width = video.value.videoWidth
  const height = video.value.videoHeight

  canvas.value.width = width
  canvas.value.height = height

  // Flip horizontally (mirror effect)
  context.translate(width, 0)
  context.scale(-1, 1)

  context.drawImage(video.value, 0, 0, width, height)

  // Capture photo
  photo.value = canvas.value.toDataURL('image/png')

  stopCamera()
}


const retakePhoto = () => {
  photo.value = null
  startCamera()
}
</script>

<template>
  <v-app :theme="theme">
    <v-container fluid class="pa-0">
      <!-- HEADER -->

      <v-app-bar class="px-3" :color="theme === 'light' ? 'blue-lighten-3' : 'grey-darken-2'">
        <v-row align="center" no-gutters class="w-100">
          <!-- Logo and Brand -->
          <v-col cols="8" class="d-flex align-center">
            <v-img src="/public/Edumatch_logo.png" alt="EduMatch Logo" max-width="60" class="mr-2"></v-img>
            <span class="text-h6 font-weight-bold">
              <b>Edu</b><span class="text-primary"><b>Match</b></span>
            </span>
          </v-col>

          <!-- Center Nav Buttons -->

          <!-- Auth Buttons and Theme Toggle -->
          <v-col cols="4" class="d-flex justify-end align-center">
            <v-text-field dense hide-details rounded="xl" variant="solo" density="compact" placeholder="Search"
              prepend-inner-icon="mdi-magnify" style="max-width: 220px" />

            <v-btn icon><v-icon>mdi-chat</v-icon></v-btn>
            <v-btn icon><v-icon>mdi-bell</v-icon></v-btn>
            <v-btn :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" variant="solo" slim
              @click="onClick"></v-btn>
            <v-avatar size="30"><v-img src="/public/tutor.jpg" /></v-avatar>
          </v-col>
        </v-row>
      </v-app-bar>

      <!-- BODY -->
      <v-container fluid class="mt-4 px-5 gradient-card pa-4">
        <v-row>
          <!-- SIDEBAR -->
          <v-col cols="12" md="3" class="d-flex flex-column align-center mt-5">
            <v-avatar size="180" class="mt-6">
              <v-img src="/public/tutor.jpg" />
            </v-avatar>
            <v-btn class="text-caption text-grey-darken-1 mt-1" size="small" rounded="xl" density="compact">
              <b>edit</b></v-btn>

            <v-card class="mt-4 px-4 py-3 text-center filter-sidebar" theme="dark">
              <div class="text-body-2 font-italic mb-5">"Learning while earning"</div>
              <v-row justify="center" class="gap-2 mb-3">
                <v-icon small>mdi-facebook</v-icon>
                <v-icon small>mdi-instagram</v-icon>
                <v-icon small>mdi-linkedin</v-icon>
                <v-icon small>mdi-twitter</v-icon>
              </v-row>
              <v-divider class="my-3"></v-divider>
              <v-btn block text prepend-icon="mdi-account">MY INFORMATION</v-btn>
              <v-btn block text prepend-icon="mdi-view-dashboard">DASHBOARD</v-btn>
              <v-btn block text color="blue-lighten-3" prepend-icon="mdi-file-document">
                SUBMIT APPLICATION
              </v-btn>
            </v-card>
          </v-col>

          <!-- FORM SECTION -->
          <v-col cols="12" md="9">
            <v-card class="pa-6 mt-10" elevation="2">
              <v-row>
                <!-- Left side of the form -->
                <v-col cols="12" md="6">
                  <v-text-field required label="First Name" variant="outlined" dense />
                  <v-text-field label="Last Name" variant="outlined" dense />
                  <v-select label="Gender" :items="['Male', 'Female']" variant="outlined" dense />
                  <v-text-field label="Subject to Teach" variant="outlined" dense />

                  <v-row>
                    <v-col><v-select label="Month" :items="months" variant="outlined" dense /></v-col>
                    <v-col><v-select label="Day" :items="days" variant="outlined" dense /></v-col>
                    <v-col><v-select label="Year" :items="years" variant="outlined" dense /></v-col>
                  </v-row>

                  <v-row>
                    <v-col><v-text-field label="hours" type="number" variant="outlined" dense /></v-col>
                    <v-col><v-text-field label="minutes" type="number" variant="outlined" dense /></v-col>
                    <v-col><v-text-field label="seconds" type="number" variant="outlined" dense /></v-col>
                  </v-row>

                  <v-select label="Time of Day" :items="['Morning', 'Afternoon', 'Evening']" variant="outlined" dense />
                  <v-select label="Teaching Mode" :items="['Online', 'Face-to-face']" variant="outlined" dense />

                  <v-row>
                    <v-col>
                      <v-text-field label="Province" variant="outlined" dense />
                    </v-col>
                    <v-col>
                      <v-text-field label="Municipality" variant="outlined" dense />
                    </v-col>
                    <v-col>
                      <v-text-field label="Barangay" variant="outlined" dense />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field label="Peso" type="number" variant="outlined" dense
                        prepend-inner-icon="mdi-currency-php" />
                    </v-col>

                    <v-col cols="6">
                      <v-text-field label="Centavo" type="number" variant="outlined" dense />
                    </v-col>
                  </v-row>

                </v-col>

                <!-- Right side of the form -->
                <v-col cols="12" md="6">
                  <v-card color="indigo-lighten-5" class="pa-4">
                    <v-textarea label="About Me" variant="solo" rows="3" auto-grow hide-details
                      class="bg-transparent" />
                  </v-card>

                  <!-- Verifying Identity -->
                  <v-card class="pa-3 mt-4" color="indigo-lighten-5">
                    <div class="text-subtitle-2 font-weight-bold">Verifying Identity</div>

                    <v-row class="mt-2" dense>
                      <!-- Upload Document -->
                      <v-col cols="12">
                        <v-card class="pa-3 text-center" outlined>
                          <v-icon color="blue" size="28">mdi-card-account-details</v-icon>
                          <p class="text-caption mt-2 mb-3">
                            Upload a clear photo of your valid government-issued ID
                          </p>
                          <input type="file" ref="fileInput" accept="image/*,.pdf" style="display: none"
                            @change="handleFileUpload" />
                          <v-btn block text small color="primary" density="comfortable" @click="triggerFileInput">
                            + Add document
                          </v-btn>
                        </v-card>
                      </v-col>

                      <!-- Take Real-Time Selfie -->
                      <v-col cols="12">
                        <v-card class="pa-3 text-center" outlined>
                          <v-icon color="blue" size="28">mdi-camera</v-icon>
                          <p class="text-caption mt-2 mb-3">
                            Take a real-time selfie with your valid government-issued ID to verify your identity
                          </p>

                          <!-- Video Preview -->
                          <video v-if="!photo" ref="video" autoplay playsinline muted class="selfie-video mb-3"></video>

                          <!-- Hidden canvas -->
                          <canvas ref="canvas" class="d-none" />

                          <!-- Buttons -->
                          <div v-if="!photo">
                            <v-row justify="center" no-gutters>
                              <v-col cols="6" class="pr-1">
                                <v-btn block text size="small" color="primary" density="comfortable" rounded="xl"
                                  @click="startCamera">
                                  <v-icon color="white" size="15">mdi-camera-enhance</v-icon> Start
                                </v-btn>
                              </v-col>
                              <v-col cols="6" class="pl-1">
                                <v-btn block text size="small" color="success" density="comfortable" rounded="xl"
                                  @click="takePhoto" :disabled="!isCameraActive">
                                  <v-icon color="white" size="15">mdi-camera-iris</v-icon> Take
                                </v-btn>
                              </v-col>
                            </v-row>
                          </div>

                          <!-- Photo Preview -->
                          <div v-if="photo" class="mt-3">
                            <h4 class=" font-weight-small">preview</h4>
                            <img :src="photo" alt="Captured Photo" class="selfie-preview mt-1 mb-2" />
                            <v-btn text small color="blue" density="comfortable" rounded="xl" @click="retakePhoto">
                              <v-icon color="white" size="15">mdi-camera-retake</v-icon> Retake
                            </v-btn>
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card>

                  <!-- Portfolio Upload -->
                  <v-card class="pa-3 mt-4" color="indigo-lighten-5">
                    <div class="text-subtitle-2 font-weight-bold">Portfolio</div>
                    <v-file-input label="Upload Portfolio" show-size variant="solo-inverted"
                      prepend-icon="mdi-upload" />
                    <p class="text-caption mt-1">
                      Supports: pdf, jpg, docx, pptx<br />
                      Maximum file size: 20 mb
                    </p>
                  </v-card>

                  <v-btn block rounded class="mt-4" color="indigo-darken-3" dark>SUBMIT</v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-app>
</template>

<style scoped>
.v-application {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.selfie-video {
  width: 100%;
  max-height: 300px;
  background-color: #000;
  border-radius: 12px;
  object-fit: cover;
  transform: scaleX(-1);
}

.selfie-preview {
  width: 100%;
  border-radius: 12px;
  border: 2px solid #ccc;
  max-height: 300px;
}

.gradient-card {
  background: linear-gradient(135deg, #0129879d, #dfe7fd, #5B74B4);
  color: white;
  border-radius: 12px;
}

.filter-sidebar {
  position: sticky;
  background-color: #172e46;
  border-radius: 16px;
  padding: 10px;
  height: "650px"
}
</style>
