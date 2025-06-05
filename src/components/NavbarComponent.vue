<template>
  <div class="fixed top-0 left-0 w-full z-50 shadow-md">
    <div class="bg-white text-black border rounded-xl p-2 flex items-center">
      <div class="flex items-center cursor-pointer mx-4">
        <h5>HackStudio</h5>
      </div>

      <ul class="flex items-center gap-4 list-none m-1 flex-grow">
        <li class="nav-item" v-for="link in Links" :key="link.name">
          <router-link class="nav-link" :to="link.link">
            {{ link.name }}
          </router-link>
        </li>
        <!-- Гость -->
        <li class="nav-item" v-if="!authStore.isAuthenticated">
          <router-link class="nav-link" to="/login">Log in</router-link>
        </li>
      </ul>

      <!-- Авторизован -->
      <li
        class="nav-item dropdown list-none mx-2"
        v-if="authStore.isAuthenticated"
      >
        <i class="bi bi-bell"></i>
      </li>
      <li
        class="nav-item dropdown list-none mx-4"
        v-if="authStore.isAuthenticated"
      >
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
            <a class="dropdown-item">My profile</a>
          </li>
          <li>
            <a class="dropdown-item" @click.prevent="switchRole('ORGANIZER')">
              Organizer
            </a>
          </li>
          <li>
            <a class="dropdown-item" @click.prevent="switchRole('PARTICIPANT')">
              Participant
            </a>
          </li>
          <li>
            <a class="dropdown-item" @click.prevent="switchRole('JUDGE')">
              Judge
            </a>
          </li>
          <li>
            <a class="dropdown-item hover:bg-red" @click.prevent="logout"
              >Log out</a
            >
          </li>
        </ul>
      </li>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/store/auth.js";
import { useRouter } from "vue-router";
import { useLogout } from "@/composables/useLogout";

export default {
  name: "NavbarComponent",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const logout = useLogout();

    function switchRole(role) {
      // Здесь лучше обновлять роль через специальный action/pinia (если реализуешь)
      authStore.role = role;

      // Перенаправлять на соответствующий кабинет
      if (role === "ORGANIZER") router.push("/dashboard");
      if (role === "PARTICIPANT") router.push("/participant");
      if (role === "JUDGE") router.push("/judge");
    }

    let Links = [
      { name: "Home", link: "/" },
      { name: "Hackathons", link: "/hackathons" },
      { name: "Leaderboard", link: "/leaderboard" },
    ];
    return { Links, authStore, switchRole, logout };
  },
};
</script>
