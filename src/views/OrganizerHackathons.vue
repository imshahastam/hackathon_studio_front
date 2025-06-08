<template>
  <div class="container mt-6">
    <div v-if="hackathons.length === 0" class="text-muted">
      You're not {{ isParticipantView ? "participating in" : "organizing" }} any
      hackathons yet.
    </div>

    <div v-else class="d-flex flex-column gap-3">
      <div
        class="card shadow-sm p-3"
        v-for="hackathon in hackathons"
        :key="hackathon.id"
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
              <strong>Members:</strong> {{ countParticipants(hackathon) }} |
              <strong>Teams:</strong> {{ countTeams(hackathon) }}
            </div>
          </div>

          <!-- Правая часть -->
          <div
            class="d-flex flex-column align-items-end justify-content-start mt-2 mt-md-0"
            style="min-width: 150px"
          >
            <!-- Кнопки доступны только организатору -->
            <div
              v-if="!isParticipantView"
              class="btn-group btn-group-sm mb-2"
              role="group"
              aria-label="Small button group"
            >
              <button
                type="button"
                class="btn btn-outline-primary"
                @click.stop="editHackathon(hackathon)"
                title="Edit"
              >
                <i class="bi bi-pencil-square"></i>
              </button>
              <button
                type="button"
                class="btn btn-outline-danger"
                @click.stop="deleteHackathon(hackathon)"
                title="Delete"
              >
                <i class="bi bi-trash3"></i>
              </button>
            </div>
            <div class="mt-3 text-end">
              <p class="text-success fw-bold mb-0">Prize fund:</p>
              <p class="text-success h5 mb-0">{{ hackathon.prizeFund }} som</p>
            </div>
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
  name: "HackathonList",
  props: {
    isParticipantView: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hackathons: [],
    };
  },
  async created() {
    const authStore = useAuthStore();
    const endpoint = this.isParticipantView
      ? "http://localhost:8080/participants/my-hackathons"
      : "http://localhost:8080/hackathons/my";

    try {
      const response = await axios.get(endpoint, {
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
      return Math.ceil((hackathon.participantIds?.length || 0) / 4);
    },
    goToHackathonDetail(hackathonId) {
      this.$router.push({
        name: "HackathonDetail",
        params: { id: hackathonId },
      });
    },
    statusBadgeClass(status) {
      switch (status) {
        case "ACTIVE":
          return "text-bg-warning";
        case "PLANNED":
          return "text-bg-secondary";
        default:
          return "text-bg-success";
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
    async deleteHackathon(hackathon) {
      if (!confirm("Are you sure you want to delete this hackathon?")) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8080/hackathons/${hackathon.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Не удалось удалить хакатон");
        }

        alert("Successfully deleted.");
        this.hackathons = this.hackathons.filter((h) => h.id !== hackathon.id);
        this.$router.back();
      } catch (error) {
        console.error("Ошибка при удалении:", error);
        alert("Error");
      }
    },
    editHackathon(hackathon) {
      this.$router.push({
        name: "EditHackathon",
        params: { id: hackathon.id },
      });
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
