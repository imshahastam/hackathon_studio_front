<template>
  <div class="container mt-5">
    <router-link v-if="isOrganizer" to="/hackathons/create">
      <button type="button" class="btn btn-outline-success">
        Создать хакатон
      </button>
    </router-link>
    <div class="row">
      <div
        class="mb-3"
        v-for="hackathon in hackathons"
        :key="hackathon.id"
        @click="goToHackathonDetail(hackathon.id)"
        style="cursor: pointer"
      >
        <hackathon-card :hackathon="hackathon" />
      </div>
    </div>
    <!-- Кнопки для переключения страниц, если нужно -->
    <div class="d-flex justify-content-center mt-3">
      <button class="btn btn-primary" @click="goToNextPage">Next</button>
    </div>
  </div>
</template>

<script>
import HackathonCard from "../components/HackathonCard.vue";
import { useAuthStore } from "@/store/auth";

export default {
  name: "HackathonList",
  components: {
    HackathonCard,
  },
  setup() {
    const authStore = useAuthStore();
    const isOrganizer = authStore.hasRole("ROLE_ORGANIZER");

    return { isOrganizer };
  },
  data() {
    return {
      hackathons: [],
      currentPage: 1,
      totalPages: 5, // примерное количество страниц
    };
  },
  methods: {
    fetchHackathons() {
      // Пример API-запроса, можешь заменить на реальный
      fetch(`http://localhost:8080/hackathons/all?page=${this.currentPage}`)
        .then((response) => response.json())
        .then((data) => {
          this.hackathons = data;
        });
    },
    goToNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchHackathons();
      }
    },
    goToHackathonDetail(hackathonId) {
      // Переход на страницу с деталями хакатона по ID
      this.$router.push({
        name: "HackathonDetail",
        params: { id: hackathonId },
      });
    },
  },
  created() {
    this.fetchHackathons();
  },
};
</script>
