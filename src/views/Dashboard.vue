<template>
  <div class="d-flex" style="min-height: 100vh">
    <SidebarComponent @logout="logout" />
    <div class="container p-4">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <div>
          <h1 class="mb-0">Welcome, {{ userName }}!</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from "@/components/SidebarComponent.vue";
import { useAuthStore } from "../store/auth.js";

export default {
  name: "DashboardPage",
  components: { SidebarComponent },
  computed: {
    userName() {
      const authStore = useAuthStore();
      console.log("Current token:", authStore.token); // Проверяем, что токен доступен
      console.log("Current username:", authStore.username);
      return authStore.username ? authStore.username : "Guest"; // Проверяем, есть ли имя пользователя
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

<style scoped></style>
