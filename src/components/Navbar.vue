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
            <router-link class="nav-link" to="/">home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/hackathons"
              >hackathons</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/leaderboard"
              >leaderboard</router-link
            >
          </li>
          <!-- Гость -->
          <li class="nav-item" v-if="!authStore.isAuthenticated">
            <router-link class="nav-link" to="/login"
              >sign up/log in</router-link
            >
          </li>

          <!-- Авторизован -->
          <li class="nav-item dropdown" v-if="authStore.isAuthenticated">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="userDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              title="Personal cabinet"
            >
              <i class="bi bi-person-video"></i>
            </a>
            <ul
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="userDropdown"
            >
              <li>
                <a
                  class="dropdown-item"
                  @click.prevent="switchRole('ORGANIZER')"
                >
                  Organizer
                </a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  @click.prevent="switchRole('PARTICIPANT')"
                >
                  Participant
                </a>
              </li>
              <li>
                <a class="dropdown-item" @click.prevent="switchRole('JUDGE')">
                  Judge
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from "@/store/auth.js";
import { useRouter } from "vue-router";

export default {
  name: "NavbarComponent",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    function switchRole(role) {
      // Тут подменяй роль пользователя, если нужно сохранять — меняй в store/pinia
      // authStore.setRole(role); // Если есть такой метод
      // Или вручную:
      authStore.role = role;

      // Перенаправлять на соответствующий кабинет
      if (role === "ORGANIZER") router.push("/dashboard");
      if (role === "PARTICIPANT") router.push("/participant");
      if (role === "JUDGE") router.push("/judge");
    }

    return { authStore, switchRole };
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
