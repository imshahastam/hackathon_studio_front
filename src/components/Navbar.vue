<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">HackStudio</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto fs-4">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Главная</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/hackathons"
              >Хакатоны</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/leaderboard"
              >Лидерборд</router-link
            >
          </li>
          <!-- Гость -->
          <li class="nav-item" v-if="!authStore.isAuthenticated">
            <router-link class="nav-link" to="/login"
              >Регистрация/Вход</router-link
            >
          </li>

          <!-- Авторизован -->
          <li class="nav-item" v-else>
            <router-link
              class="nav-link"
              to="/dashboard"
              title="Личный кабинет"
            >
              <i class="bi bi-person-video"></i>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from "@/store/auth.js";

export default {
  name: "NavbarComponent",
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
};
</script>

<style scoped>
.navbar {
  z-index: 1000;
}

.navbar-nav .nav-link {
  font-weight: bold;
}
</style>
