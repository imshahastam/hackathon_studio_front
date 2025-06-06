<template>
  <div class="wrapper bg-light">
    <div class="d-flex">
      <SidebarComponent @logout="logout" />
      <div class="container p-4">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <div>
            <h1 class="mb-0">Welcome, {{ userName }}!</h1>
          </div>
        </div>

        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from "@/components/sidebars/SidebarComponent.vue";
import { useAuthStore } from "../../store/auth.js";

export default {
  name: "OrganizerDashboard",
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

<style scoped>
.wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
