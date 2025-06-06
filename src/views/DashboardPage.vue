<!-- src/DashboardPage.vue -->
<template>
  <component :is="dashboardComponent" @logout="logout" />
</template>

<script>
import { useAuthStore } from "@/store/auth.js";
import { computed } from "vue";
import OrganizerDashboard from "@/views/dashboards/OrganizerDashboard.vue";
import JudgeDashboard from "@/views/dashboards/JudgeDashboard.vue";
import ParticipantDashboard from "@/views/dashboards/ParticipantDashboard.vue";

export default {
  name: "DashboardPage",
  components: {
    OrganizerDashboard,
    JudgeDashboard,
    ParticipantDashboard,
  },
  setup() {
    const authStore = useAuthStore();

    const logout = () => {
      authStore.clearToken();
      window.location.href = "/";
    };

    const dashboardComponent = computed(() => {
      switch (authStore.roles[0]) {
        case "ROLE_ORGANIZER":
          return "OrganizerDashboard";
        case "ROLE_JUDGE":
          return "JudgeDashboard";
        case "ROLE_PARTICIPANT":
          return "ParticipantDashboard";
        default:
          return null;
      }
    });

    return { dashboardComponent, logout };
  },
};
</script>
