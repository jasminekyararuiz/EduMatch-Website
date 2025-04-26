<script setup>
import { ref } from 'vue'
import { provinceOptions, municipalityData } from '@/data/CaragaData';
const theme = ref('light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
import { requiredValidator } from '@/utils/validators.js'

const months = ['January', 'February', 'March', 'April','May','June','July','August','September','October','November','December']
const days = Array.from({ length: 31 }, (_, i) => i + 1)
const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i)
const municipalityOptions = ref([]);

const updateMunicipalities = (selectedProvince) => {
  municipalityOptions.value = municipalityData[selectedProvince] || [];
  form.municipality = ''; // Reset selected municipality
};

const form = ref({
  name: '',
  gender: '',
  subjects: '',
  month: '',
  day: '',
  year: '',
  timeFrom: '',
  timeTo: '',
  teachingMode: '',
  province: '',
  municipality: '',
  peso: '',
  centavos: '',
})

const isFormValid = ref(false)
const formRef = ref(null)


const video = ref(null)
const canvas = ref(null)
const photo = ref(null)
const isCameraActive = ref(false)
let stream = null

const fileInput = ref(null);
const uploadedFile = ref(null);
const previewUrl = ref('');

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadedFile.value = file;
    console.log('Uploaded document:', file);

    // Create a preview if it's an image
    if (file.type.startsWith('image/')) {
      previewUrl.value = URL.createObjectURL(file);
    } else {
      previewUrl.value = '';
    }
  }
}

function submitForm() {
  formRef.value?.validate().then(success => {
    if (success) {
      // all fields are valid, proceed with form submission
      console.log('Form data:', form)
    } else {
      console.warn('Form is invalid')
    }
  })
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

      <v-app-bar class="px-3" :color="theme === 'light' ? 'indigo-darken-4' : 'grey-darken-2'">
        <v-row align="center" no-gutters class="w-100">
          <v-col cols="8" class="d-flex align-center">
            <v-img src="/public/Edumatch_logo.png" max-width="60" class="mr-2" />
            <span class="text-h6 font-weight-bold">
              <b>Edu</b><span class="text-cyan-darken-1"><b>Match</b></span>
            </span>
          </v-col>
          <v-col cols="4" class="d-flex justify-end align-center">
            <v-text-field
              dense
              hide-details
              rounded="xl"
              variant="solo"
              density="compact"
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              style="max-width: 220px"
            />
            <v-btn icon><v-icon>mdi-chat</v-icon></v-btn>
            <v-btn icon><v-icon>mdi-bell</v-icon></v-btn>
            <v-btn
              :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
              slim
              @click="onClick"
            />
            <v-avatar size="30"><v-img src="public/heeseung.jpg" /></v-avatar>
          </v-col>
        </v-row>
      </v-app-bar>
      <!-- BODY -->
      <v-container fluid class="mt-4 px-5 pa-4"  :color="theme === 'light' ? 'indigo-lighten-5' : 'grey-darken-3'" >
        <v-row >
          <!-- SIDEBAR -->
          <v-col cols="12" md="3" class="d-flex flex-column align-center mt-5" >
            <v-avatar size="180" class="mt-6 border border-5">
              <v-img src="/public/tutor.jpg" />
            </v-avatar>
            <v-btn
              class="text-caption text-grey-darken-1 mt-1"
              size="small"
              rounded="xl"
              density="compact"
            >
              <b>edit</b></v-btn
            >

            <v-card class="mt-4 px-4 py-3 text-center " rounded="lg" :color="theme === 'light' ? 'indigo-darken-4' : 'grey-darken-3'">
              <div class="text-body-2 font-italic mb-5">"Learning while earning"</div>
              <v-row justify="center" class="gap-2 mb-3">
                <v-icon small>mdi-facebook</v-icon>
                <v-icon small>mdi-instagram</v-icon>
                <v-icon small>mdi-linkedin</v-icon>
                <v-icon small>mdi-twitter</v-icon>
              </v-row>
              <v-divider class="my-2"></v-divider>
              <v-btn block text prepend-icon="mdi-file-document">
                SUBMIT APPLICATION
              </v-btn>
            </v-card>
          </v-col>

          <!-- FORM SECTION -->
          <v-col cols="12" md="9">
            <v-card class="pa-6 mt-10" elevation="2">
              <v-form ref="formRef" v-model="isFormValid">
              <v-row>
                <!-- Left side of the form -->
                <v-col cols="12" md="6">
    <v-text-field
      v-model="form.name"
      label="Full Name"
      :rules="[requiredValidator]"
    />

    <v-select
      v-model="form.gender"
      :items="['Male', 'Female']"
      label="Gender"
      :rules="[requiredValidator]"
    />

    <v-text-field
      v-model="form.subjects"
      label="Major"
      :rules="[requiredValidator]"
    />

    <div class="flex gap-2">
      <v-select
        v-model="form.month"
        :items="months"
        label="Month"
        :rules="[requiredValidator]"
      />
      <v-select
        v-model="form.day"
        :items="days"
        label="Day"
        :rules="[requiredValidator]"
      />
      <v-select
        v-model="form.year"
        :items="years"
        label="Year"
        :rules="[requiredValidator]"
      />
    </div>
    <v-row>
  <v-col cols="6">
    <v-text-field
      v-model="form.timeFrom"
      label="Available From"
      type="time"
      :rules="[requiredValidator]"
    />
  </v-col>

  <v-col cols="6">
    <v-text-field
      v-model="form.timeTo"
      label="Available To"
      type="time"
      :rules="[requiredValidator]"
    />
  </v-col>
</v-row>

    <v-select
      v-model="form.teachingMode"
      :items="['Online', 'Face-to-Face', 'Both']"
      label="Teaching Mode"
      :rules="[requiredValidator]"
    />
    <v-select
      v-model="form.province"
      :items="provinceOptions"
      label="Province"
      :rules="[requiredValidator]"
      @update:modelValue="updateMunicipalities"
    />

    <v-select
      v-model="form.municipality"
      :items="municipalityOptions"
      label="Municipality/City"
      :rules="[requiredValidator]"
    />


    <v-text-field
  v-model="form.fullRate"
  label="Rate"
  type="number"
  step="0.01"
  min="50"
  max="1000"
  prefix="₱"
  hide-spin-buttons
  :rules="[
    requiredValidator,
    val => !isNaN(val) || 'Must be a number',
    val => (val >= 50 && val <= 2000) || 'Must be between ₱50.00 and ₱2000.00'
  ]"
/>

                </v-col>

                <!-- Right side of the form -->
                <v-col cols="12" md="6">
                  <v-card  :color="theme === 'light' ? 'indigo-lighten-5' : 'grey-darken-3'" class="pa-4" >
                    <v-textarea
                      label="About Me"
                      variant="solo"
                      rows="3"
                      auto-grow
                      hide-details
                      class="bg-transparent"
                    />
                  </v-card>

                  <!-- Verifying Identity -->
                  <v-card class="pa-3 mt-4"  :color="theme === 'light' ? 'indigo-lighten-5' : 'grey-darken-3'">
                    <div class="text-subtitle-2 font-weight-bold">Verifying Identity</div>

                    <v-row class="mt-2" dense>
                      <!-- Upload Document -->
                      <v-col cols="12">
                        <v-card class="pa-3 text-center" outlined>
    <v-icon color="blue" size="28">mdi-card-account-details</v-icon>
    <p class="text-caption mt-2 mb-3">
      Upload a clear photo of your valid government-issued ID
    </p>

    <input
      type="file"
      ref="fileInput"
      accept="image/*,.pdf"
      style="display: none"
      @change="handleFileUpload"
    />
<!-- Show image preview if available -->
<div v-if="previewUrl" class="mt-4">
      <img :src="previewUrl" alt="Preview" style="max-width: 100%; height:250px; margin-top: 10px;" />
    </div>


    <!-- Show file name if not image -->
    <div v-else-if="uploadedFile" class="mt-4">
      <p><b>Uploaded File:</b>: {{ uploadedFile.name }}</p> 
    </div>
    <v-btn
      block
      text
      small
      color="primary"
      density="comfortable"
      @click="triggerFileInput"
    >
      + Add document
    </v-btn>

    
  </v-card>
                      </v-col>

                      <!-- Take Real-Time Selfie -->
                      <v-col cols="12">
                        <v-card class="pa-3 text-center" outlined>
                          <v-icon color="blue" size="28">mdi-camera</v-icon>
                          <p class="text-caption mt-2 mb-3">
                            Take a real-time selfie with your valid government-issued ID to verify
                            your identity
                          </p>

                          <!-- Video Preview -->
                          <video
                            v-if="!photo"
                            ref="video"
                            autoplay
                            playsinline
                            muted
                            class="selfie-video mb-3"
                          ></video>

                          <!-- Hidden canvas -->
                          <canvas ref="canvas" class="d-none" />

                          <!-- Buttons -->
                          <div v-if="!photo">
                            <v-row justify="center" no-gutters>
                              <v-col cols="6" class="pr-1">
                                <v-btn
                                  block
                                  text
                                  size="small"
                                  color="primary"
                                  density="comfortable"
                                  rounded="xl"
                                  @click="startCamera"
                                >
                                  <v-icon color="white" size="15">mdi-camera-enhance</v-icon> Start
                                </v-btn>
                              </v-col>
                              <v-col cols="6" class="pl-1">
                                <v-btn
                                  block
                                  text
                                  size="small"
                                  color="success"
                                  density="comfortable"
                                  rounded="xl"
                                  @click="takePhoto"
                                  :disabled="!isCameraActive"
                                >
                                  <v-icon color="white" size="15">mdi-camera-iris</v-icon> Take
                                </v-btn>
                              </v-col>
                            </v-row>
                          </div>

                          <!-- Photo Preview -->
                          <div v-if="photo" class="mt-3">
                            <h4 class="font-weight-small">preview</h4>
                            <img
                              :src="photo"
                              alt="Captured Photo"
                              class="selfie-preview mt-1 mb-2"
                            />
                            <v-btn
                              text
                              small
                              color="blue"
                              density="comfortable"
                              rounded="xl"
                              @click="retakePhoto"
                            >
                              <v-icon color="white" size="15">mdi-camera-retake</v-icon> Retake
                            </v-btn>
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card>

                  <!-- Portfolio Upload -->
                  <v-card class="pa-3 mt-4"  :color="theme === 'light' ? 'indigo-lighten-5' : 'grey-darken-3'">
                    <div class="text-subtitle-2 font-weight-bold">Portfolio</div>
                    <v-file-input label="Upload Portfolio" show-size variant="solo-inverted"
                      prepend-icon="mdi-upload"
                      accept=".jpg,.pdf,.docx,.pptx" />
                    <p class="text-caption mt-1">
                      Supports: pdf, jpg, docx, pptx<br />
                    </p>
                  </v-card>

                  <v-btn  block rounded class="mt-4" color="indigo-darken-3" @click="submitForm" :disabled="!isFormValid">Submit</v-btn>
                </v-col>
              </v-row>
  </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <v-footer
      :color="theme === 'light' ? 'grey-lighten-4' : 'grey-darken-4'"
      :class="theme === 'light' ? 'text-black' : 'text-white'"
    >
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
                  <v-icon color="blue" size="18" class="me-2">mdi-instagram</v-icon> lnheitmy
                </div>
                <div class="d-flex align-center mb-1 text-caption">
                  <v-icon color="blue" size="18" class="me-2">mdi-twitter</v-icon> lenit
                </div>
                <div class="d-flex align-center mb-1 text-caption">
                  <v-icon color="blue" size="18" class="me-2">mdi-gmail</v-icon>
                  leanheitmay@gmail.com
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
          <span class="text-caption text-grey-darken-1"
            >© 2025 EduMatch — All Rights Reserved.</span
          >
        </v-row>
      </v-container>
    </v-footer>
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
.gradient-light {
  background: linear-gradient(to bottom, #f5f7fa, #c3cfe2);
}

.gradient-dark {
  background: linear-gradient(to bottom, #1f1f1f, #2b2b2b);
}

.filter-sidebar {
  position: sticky;
  background-color: #172e46;
  border-radius: 16px;
  padding: 10px;
  height: '650px';
}
</style>
