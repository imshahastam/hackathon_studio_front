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

      <!-- Меню пользователя -->
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
          <li v-for="role in availableRoles" :key="role">
            <a class="dropdown-item" @click.prevent="switchRole(role)">
              {{ formatRole(role) }}
            </a>
          </li>
          <li>
            <a class="dropdown-item text-danger" @click.prevent="logout"
              >Log out</a
            >
          </li>
        </ul>
      </li>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
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
      authStore.role = role;

      if (role === "ROLE_ORGANIZER") router.push("/organizer");
      if (role === "ROLE_PARTICIPANT") router.push("/participant");
      if (role === "ROLE_JUDGE") router.push("/judge");
    }

    const availableRoles = computed(() => authStore.roles);

    function formatRole(role) {
      const map = {
        ROLE_ORGANIZER: "Organizer",
        ROLE_PARTICIPANT: "Participant",
        ROLE_JUDGE: "Judge",
      };
      return map[role] || role;
    }

    let Links = [
      { name: "Home", link: "/" },
      { name: "Hackathons", link: "/hackathons" },
      { name: "Leaderboard", link: "/leaderboard" },
    ];

    return {
      Links,
      authStore,
      switchRole,
      logout,
      availableRoles,
      formatRole,
    };
  },
};
</script>
