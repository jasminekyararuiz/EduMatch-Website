<script setup>
import { supabase, formActionDefault } from "@/utils/supabase";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const router = useRouter();

const formAction = ref({ ...formActionDefault });
const userData = ref({
  name: "",
  avatar_url: "",
  province: "",
  municipality: "",
  subjects: "",
});
const userRole = ref(""); // removed 'guest'
const userEmail = ref("");

// Fallback initials from name/email
const getAvatarText = (text) => {
  return text
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("");
};

onMounted(async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("User authentication failed:", error?.message);
    return;
  }

  userEmail.value = user.email;

  const metadata = user.user_metadata || {};
  const first = metadata.firstname || "";
  const last = metadata.lastname || "";
  const role = metadata.role?.toLowerCase() || "";

  userData.value.name = `${first} ${last}`.trim();
  userRole.value = role; // use role from metadata directly

  // Optionally fetch extended info (like subjects/province)
  const table = role === "tutor" ? "applications" : role === "learner" ? "applications" : null;
  const idField = role === "tutor" ? "tutor_id" : role === "learner" ? "learner_id" : null;

  if (table && idField) {
    const { data: profileData } = await supabase
      .from(table)
      .select("*")
      .eq(idField, user.id)
      .single();

    if (profileData) {
      userData.value = {
        ...userData.value,
        ...profileData,
      };
    }
  }
});

const onLogout = async () => {
  formAction.value = { ...formActionDefault, formProcess: true };
  await supabase.auth.signOut();
  formAction.value.formProcess = false;
  userData.value = null;
  userRole.value = null;
  router.replace("/");
};
</script>


<template>
  <v-menu min-width="200px" rounded v-if="userData">
    <template #activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar
          v-if="userData.avatar_url"
          :image="userData.avatar_url"
          color="orange-darken-3"
          size="large"
        />
        <v-avatar v-else color="cyan-darken-1" size="large">
          <span class="text-h5">{{ getAvatarText(userData.name || userEmail) }}</span>
        </v-avatar>
      </v-btn>
    </template>

    <v-card class="mt-1">
      <v-card-text>
        <v-list>
          <v-list-item
          :subtitle="userRole === 'tutor' ? 'Tutor' : userRole === 'learner' ? 'Learner' : 'Guest'"
            :title="userData.name || userEmail"
          >
            <template #prepend>
              <v-avatar
                v-if="userData.avatar_url"
                :image="userData.avatar_url"
                color="blue-darken-4"
                size="large"
              />
              <v-avatar v-else color="cyan-darken-1" size="large">
                <span class="text-h5">{{ getAvatarText(userData.name || userEmail) }}</span>
              </v-avatar>
            </template>
          </v-list-item>
        </v-list>

        <v-divider class="my-3" />

        <v-btn
          prepend-icon="mdi-logout"
          variant="plain"
          @click="onLogout"
          :loading="formAction.formProcess"
          :disabled="formAction.formProcess"
        >
          Logout
        </v-btn>
      </v-card-text>
    </v-card>
  </v-menu>
</template>
