<script setup>
import { ref } from 'vue';
import { provinceOptions, municipalityData } from '@/data/CaragaData';
import { requiredValidator } from '@/utils/validators.js';
import { supabase } from '@/utils/supabase';

// Theme toggle
const theme = ref('light');
function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
}

// Form data
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
  fullRate: '',
  aboutMe: '',
  idPhotoFile: null,
  selfiePhotoFile: null,
  portfolioFile: null,
  avatarUrl: null,
});
const isFormValid = ref(false);
const formRef = ref(null);

// Dropdowns
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i);
const municipalityOptions = ref([]);

const updateMunicipalities = (selectedProvince) => {
  municipalityOptions.value = municipalityData[selectedProvince] || [];
  form.value.municipality = '';
};

// File input and preview
const fileInput = ref(null);
const previewUrl = ref(null);
const uploadedFile = ref(null);

// Camera
const video = ref(null);
const canvas = ref(null);
const photo = ref(null);
const isCameraActive = ref(false);
let stream = null;

const triggerFileInput = () => {
  if (fileInput.value) fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    alert('Only JPG, PNG, or PDF allowed.');
    event.target.value = null;
    return;
  }

  if (file.size > maxSize) {
    alert('Max file size is 5MB.');
    event.target.value = null;
    return;
  }

  form.value.idPhotoFile = file;
  uploadedFile.value = file;

  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    previewUrl.value = null;
  }
};

// Camera functions
const startCamera = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (video.value) {
      video.value.srcObject = stream;
      video.value.play();
      isCameraActive.value = true;
    }
  } catch (err) {
    console.error('Camera error:', err);
  }
};

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    isCameraActive.value = false;
    stream = null;
  }
};

const takePhoto = () => {
  if (!video.value || !canvas.value) return;
  const width = video.value.videoWidth;
  const height = video.value.videoHeight;
  canvas.value.width = width;
  canvas.value.height = height;

  const context = canvas.value.getContext('2d');
  context.translate(width, 0);
  context.scale(-1, 1);
  context.drawImage(video.value, 0, 0, width, height);

  photo.value = canvas.value.toDataURL('image/png');
  stopCamera();
};

const retakePhoto = () => {
  photo.value = null;
  startCamera();
};

// Upload file to Supabase
const uploadFile = async (file, folder) => {
  if (!file) return null;

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error('Auth error:', authError?.message);
    return null;
  }

  const bucket = 'tutor-uploads';
  const filename = `${folder}/${user.id}_${Date.now()}_${file.name}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, file);

  if (error) {
    console.error('Upload failed:', error.message);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filename);

  return publicUrl;
  
};


// Submit form
const submitForm = async () => {
  const validation = await formRef.value?.validate?.();
  if (!validation?.valid) {
    console.warn('Invalid form');
    return;
  }

  try {
    // Get currently authenticated user (for user_id column or RLS)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('User not authenticated');
      alert('You must be logged in to submit.');
      return;
    }

    // Upload files
    const idPhotoUrl = await uploadFile(form.value.idPhotoFile, 'id-photos');
    const selfiePhotoUrl = await uploadFile(dataUrlToFile(photo.value, 'selfie.png'), 'selfie-photos');
    const portfolioUrl = await uploadFile(form.value.portfolioFile, 'portfolios');
    const avatarUrl = await uploadFile(form.value.avatarFile, 'avatars');

    if (!idPhotoUrl || !selfiePhotoUrl) {
      alert('Missing required images.');
      return;
    }

    // Prepare data for insertion
    const formDataToInsert = {
      name: form.value.name,
      gender: form.value.gender,
      subjects: form.value.subjects,
      month: form.value.month,
      day: parseInt(form.value.day),
      year: parseInt(form.value.year),
      time_from: form.value.timeFrom,
      time_to: form.value.timeTo,
      teaching_mode: form.value.teachingMode,
      province: form.value.province,
      municipality: form.value.municipality,
      full_rate: parseFloat(form.value.fullRate),
      about_me: form.value.aboutMe?.trim() ?? '',
      id_photo_url: idPhotoUrl,
      selfie_photo_url: selfiePhotoUrl,
      portfolio_url: portfolioUrl,
      avatar_url: avatarUrl,
      created_at: new Date().toISOString(), // optional if DB handles it
      // user_id: user.id // 👈 Add this only if your table has this column
    };

    const { error } = await supabase.from('tutors').insert([formDataToInsert]);

    if (error) {
      console.error('Insert error:', error.message);
      alert('Submission failed.');
      return;
    }

    alert('Submitted successfully!');
    resetForm();
  } catch (err) {
    console.error('Submit error:', err);
    alert('Unexpected error occurred.');
  }
};

const avatarUrl = ref('/public/adelle.jpg')
const fileInputRef = ref(null)

const openFileDialog = () => {
  fileInputRef.value.click()
}

const onFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return
form.value.avatarFile = file
  const uploadedUrl = await uploadFile(file, 'avatars')
  if (uploadedUrl) {
    avatarUrl.value = uploadedUrl
  }
}

// Convert dataURL to File
const dataUrlToFile = (dataUrl, filename) => {
  if (!dataUrl) return null;
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
};

// Reset
const resetForm = () => {
  form.value = {
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
    fullRate: '',
    aboutMe: '',
    idPhotoFile: null,
    selfiePhotoFile: null,
    portfolioFile: null,
    avatarUrl: null,
  };
  photo.value = null;
  previewUrl.value = null;
  uploadedFile.value = null;
  formRef.value?.reset?.();
};



// Optional test function
const testUpload = async () => {
  const testFile = new File(['Test content'], 'test.txt', { type: 'text/plain' });
  const url = await uploadFile(testFile, 'test-folder');
  console.log('Test upload URL:', url);
};

// testUpload(); // Uncomment to test
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
            <v-text-field dense hide-details rounded="xl" variant="solo" density="compact" placeholder="Search"
              prepend-inner-icon="mdi-magnify" style="max-width: 220px" />
            <v-btn icon><v-icon>mdi-chat</v-icon></v-btn>
            <v-btn icon><v-icon>mdi-bell</v-icon></v-btn>
            <v-btn :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" slim @click="onClick" />
            <v-avatar size="30"><v-img :src="avatarUrl" /></v-avatar>
          </v-col>
        </v-row>
      </v-app-bar>
      <!-- BODY -->
      <v-container fluid class="mt-4 px-5 pa-4" :color="theme === 'light' ? 'indigo-lighten-5' : 'grey-darken-3'">
        <v-row>
          <!-- SIDEBAR -->
          <v-col cols="12" md="3" class="d-flex flex-column align-center mt-5">
            <v-avatar size="180" class="mt-6 border border-5">
      <v-img :src="avatarUrl" />
    </v-avatar>

    <v-btn
      class="text-caption text-grey-darken-1 mt-1"
      size="small"
      rounded="xl"
      density="compact"
      @click="openFileDialog"
    >
      <b>edit</b>
    </v-btn>

    <!-- Hidden file input -->
    <input
      type="file"
      accept="image/*"
      ref="fileInputRef"
      class="d-none"
      @change="onFileChange"
    />

            <v-card class="mt-4 px-4 py-3 text-center " rounded="lg"
              :color="theme === 'light' ? 'indigo-darken-4' : 'grey-darken-3'">
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
                    <v-text-field v-model="form.name" label="Full Name" :rules="[requiredValidator]" />

                    <v-select v-model="form.gender" :items="['Male', 'Female']" label="Gender"
                      :rules="[requiredValidator]" />

                    <v-text-field v-model="form.subjects" label="Major" :rules="[requiredValidator]" />
                   

                    <div class="flex gap-2">
                      <v-select v-model="form.month" :items="months" label="Month" :rules="[requiredValidator]" />
                      <v-select v-model="form.day" :items="days" label="Day" :rules="[requiredValidator]" />
                      <v-select v-model="form.year" :items="years" label="Year" :rules="[requiredValidator]" />
                    </div>
                    <v-row>
                      <v-col cols="6">
                        <v-text-field v-model="form.timeFrom" label="Available From" type="time"
                          :rules="[requiredValidator]" />
                      </v-col>

                      <v-col cols="6">
                        <v-text-field v-model="form.timeTo" label="Available To" type="time"
                          :rules="[requiredValidator]" />
                      </v-col>
                    </v-row>

                    <v-select v-model="form.teachingMode" :items="['Online', 'Face-to-Face', 'Both']"
                      label="Teaching Mode" :rules="[requiredValidator]" />
                    <v-select v-model="form.province" :items="provinceOptions" label="Province"
                      :rules="[requiredValidator]" @update:modelValue="updateMunicipalities" />

                    <v-select v-model="form.municipality" :items="municipalityOptions" label="Municipality/City"
                      :rules="[requiredValidator]" />


                    <v-text-field v-model="form.fullRate" label="Rate" type="number" step="0.01" min="50" max="1000"
                      prefix="₱" hide-spin-buttons :rules="[
                        requiredValidator,
                        val => !isNaN(val) || 'Must be a number',
                        val => (val >= 50 && val <= 2000) || 'Must be between ₱50.00 and ₱2000.00'
                      ]" />

                  </v-col>

                  <!-- Right side of the form -->
                  <v-col cols="12" md="6">
                    <v-card :color="theme === 'light' ? 'indigo-lighten-5' : 'grey-darken-3'" class="pa-4">
                      <v-textarea 
                      v-model="form.aboutMe" 
                      label="About Me" 
                      variant="solo" 
                      rows="3" 
                      :rules="[requiredValidator]"
                      auto-grow 
                      hide-details
                        class="bg-transparent" />
                    </v-card>

                    <!-- Verifying Identity -->
                    <v-card class="pa-3 mt-4" :color="theme === 'light' ? 'indigo-lighten-5' : 'grey-darken-3'">
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
                            <!-- Show image preview if available -->
                            <div v-if="previewUrl" class="mt-4">
                              <img :src="previewUrl" alt="Preview"
                                style="max-width: 100%; height:250px; margin-top: 10px;" />
                            </div>


                            <!-- Show file name if not image -->
                            <div v-else-if="uploadedFile" class="mt-4">
                              <p><b>Uploaded File:</b>: {{ uploadedFile.name }}</p>
                            </div>
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
                              Take a real-time selfie with your valid government-issued ID to verify
                              your identity
                            </p>

                            <!-- Video Preview -->
                            <video v-if="!photo" ref="video" autoplay playsinline muted
                              class="selfie-video mb-3"></video>

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
                              <h4 class="font-weight-small">preview</h4>
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
                    <v-card class="pa-3 mt-4" :color="theme === 'light' ? 'indigo-lighten-5' : 'grey-darken-3'">
                      <div class="text-subtitle-2 font-weight-bold">Portfolio</div>
                      <v-file-input label="Upload Portfolio" show-size variant="solo-inverted" prepend-icon="mdi-upload"
                        accept=".jpg,.pdf,.docx,.pptx" 
                        @change="(e) => form.portfolioFile = e.target.files[0]"/>
                      <p class="text-caption mt-1">
                        Supports: pdf, jpg, docx, pptx<br />
                      </p>
                    </v-card>

                    <v-btn block rounded class="mt-4" color="indigo-darken-3" @click="submitForm"
                      :disabled="!isFormValid">Submit</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

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
          <span class="text-caption text-grey-darken-1">© 2025 EduMatch — All Rights Reserved.</span>
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
