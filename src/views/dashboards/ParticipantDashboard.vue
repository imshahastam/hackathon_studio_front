<!-- src/views/dashboards/ParticipantDashboard.vue -->
<template>
  <div class="d-flex" style="min-height: 100vh">
    <ParticipantSidebar @logout="logout" />
    <div class="container p-4">
      <h1>Welcome, {{ userName }}!</h1>
      <p>
        Здесь будет личный кабинет участника: список хакатонов, команды, рейтинг
        и т.п.
      </p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/store/auth";
import ParticipantSidebar from "@/components/sidebars/ParticipantSidebar.vue";

export default {
  name: "ParticipantDashboard",
  components: { ParticipantSidebar },
  computed: {
    userName() {
      const authStore = useAuthStore();
      return authStore.username || "Participant";
    },
  },
  methods: {
    logout() {
      const authStore = useAuthStore();
      authStore.clearToken();
      this.$router.push("/");
    },
  },
};
</script>
