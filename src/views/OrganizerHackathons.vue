<template>
  <div class="container mt-4">
    <h2 class="mb-3">Мои хакатоны</h2>

    <div v-if="hackathons.length === 0" class="text-muted">
      Вы пока не организовываете ни один хакатон.
    </div>

    <div v-else class="d-flex flex-column gap-3">
      <div
        class="card shadow-sm p-3"
        v-for="hackathon in hackathons"
        :key="hackathon.name"
        @click="goToHackathonDetail(hackathon.id)"
        style="cursor: pointer"
      >
        <div
          class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
        >
          <!-- Левая часть -->
          <div class="mb-2 mb-md-0">
            <h4 class="mb-1">{{ hackathon.name }}</h4>
            <div class="mb-2">
              <!-- Статус и тип в виде badges -->
              <span class="badge" :class="statusBadgeClass(hackathon.status)">{{
                hackathon.status
              }}</span>
              <span class="badge" :class="typeBadgeClass(hackathon.type)">{{
                hackathon.type
              }}</span>
            </div>
            <div v-if="hackathon.location" class="text-muted">
              <i class="bi bi-geo-alt-fill me-1"></i>{{ hackathon.location }}
            </div>
            <div class="mt-2 small">
              <strong>Участников:</strong> {{ countParticipants(hackathon) }} |
              <strong>Команд:</strong> {{ countTeams(hackathon) }}
            </div>
          </div>

          <!-- Правая часть -->
          <div class="text-end text-md-end mt-2 mt-md-0">
            <p class="text-success fw-bold mb-0">Призовой фонд:</p>
            <p class="text-success h5 mb-0">{{ hackathon.prizeFund }} сом</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "../store/auth.js";

export default {
  name: "OrganizerHackathons",
  data() {
    return {
      hackathons: [],
    };
  },
  async created() {
    const authStore = useAuthStore();
    try {
      const response = await axios.get("http://localhost:8080/hackathons/my", {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      this.hackathons = response.data;
    } catch (error) {
      console.error("Ошибка при загрузке хакатонов:", error);
    }
  },
  methods: {
    countParticipants(hackathon) {
      return hackathon.participantIds?.length || 0;
    },
    countTeams(hackathon) {
      // пока нет информации о командах, можно заглушку:
      return Math.ceil((hackathon.participantIds?.length || 0) / 4); // например, 4 чел. в команде
    },
    goToHackathonDetail(hackathonId) {
      // Переход на страницу с деталями хакатона по ID
      this.$router.push({
        name: "HackathonDetail",
        params: { id: hackathonId },
      });
    },
    statusBadgeClass(status) {
      switch (status) {
        case "ACTIVE":
          return "text-bg-warning"; // Желтый для активных
        case "PLANNED":
          return "text-bg-secondary"; // Серый для запланированных
        default:
          return "text-bg-success"; // Зеленый для других статусов
      }
    },
    typeBadgeClass(type) {
      switch (type) {
        case "ONLINE":
          return "text-bg-light";
        case "OFFLINE":
          return "text-bg-dark";
        default:
          return "text-bg-info";
      }
    },
  },
};
</script>

<style scoped>
.card {
  border-left: 5px solid #0d6efd;
  transition: box-shadow 0.2s ease;
}
.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
