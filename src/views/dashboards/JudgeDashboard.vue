<!-- src/views/dashboards/JudgeDashboard.vue -->
<template>
  <div class="d-flex" style="min-height: 100vh">
    <JudgeSidebar @logout="logout" />
    <div class="container p-4">
      <h1>Welcome, {{ userName }}!</h1>
      <p>
        Здесь будет личный кабинет судьи: оценка проектов, список назначенных
        хакатонов и пр.
      </p>

      <router-view />
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/store/auth";
import JudgeSidebar from "@/components/sidebars/JudgeSidebar.vue";

export default {
  name: "JudgeDashboard",
  components: { JudgeSidebar },
  computed: {
    userName() {
      const authStore = useAuthStore();
      return authStore.username || "Judge";
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
