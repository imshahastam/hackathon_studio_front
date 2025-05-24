<template>
  <div class="container mt-4">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <div>
        <h1 class="mb-0">Dashboard</h1>
        <p class="mb-0">Welcome, {{ userName }}!</p>
      </div>
      <button @click="logout" class="btn btn-outline-danger btn-sm ms-3">
        Log out
      </button>
    </div>
    <OrganizerHackathons />
  </div>
</template>

<script>
import OrganizerHackathons from "./OrganizerHackathons.vue";
import { useAuthStore } from "../store/auth.js";

export default {
  name: "DashboardPage",
  components: { OrganizerHackathons },
  computed: {
    userName() {
      const authStore = useAuthStore();
      console.log("Current token:", authStore.token); // Проверяем, что токен доступен
      console.log("Current username:", authStore.username);
      return authStore.username ? authStore.username : "Гость"; // Проверяем, есть ли имя пользователя
    },
  },
  methods: {
    logout() {
      const authStore = useAuthStore();
      authStore.clearToken(); // Удаляем токен из Pinia и localStorage
      this.$router.push("/"); // Перенаправляем на страницу входа
    },
  },
  watch: {
    // Слушаем изменения в store
    userName(newValue, oldValue) {
      console.log(`Имя пользователя изменилось с ${oldValue} на ${newValue}`);
    },
  },
};
</script>

<style scoped>
/* Можно добавить стили для личного кабинета */
</style>
