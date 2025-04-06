<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Platform</router-link>
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
        <ul class="navbar-nav ms-auto">
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
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" to="/login"
              >Регистрация/Вход</router-link
            >
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <router-link class="nav-link" to="/dashboard"
              >Личный кабинет</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavbarComponent",
  data() {
    return {
      isAuthenticated: false, // Заменить на реальную проверку авторизации
    };
  },
  mounted() {
    // Здесь можно добавить проверку авторизации пользователя
    this.isAuthenticated = !!localStorage.getItem("userToken"); // Пример проверки по токену
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
