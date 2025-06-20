<template>
  <div class="container mt-4" v-if="hackathon">
    <!-- Заголовок + кнопки справа -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-0">{{ hackathon.name }}</h2>
      <!-- Регистрация (только для PARTICIPANT и если не организатор) -->
      <div v-if="showRegisterBlock" class="mt-4">
        <button
          v-if="!hasApplied"
          class="btn btn-success"
          @click="registerToHackathon"
        >
          Register
        </button>
        <span v-if="hasApplied" class="text-success fw-semibold">
          ✅ Your application has been received.
        </span>
      </div>
      <div class="d-flex gap-2" v-if="isMyHackathon">
        <button
          type="button"
          class="btn btn-outline-warning btn-sm"
          @click="editHackathon"
        >
          Edit
        </button>
        <button
          type="button"
          class="btn btn-outline-danger btn-sm"
          @click="deleteHackathon"
        >
          Delete
        </button>
      </div>
    </div>

    <div class="mb-3">
      <!-- Статус и тип в виде badges -->
      <span class="badge" :class="statusBadgeClass(hackathon.status)">{{
        hackathon.status
      }}</span>
      <span class="badge" :class="typeBadgeClass(hackathon.type)">{{
        hackathon.type
      }}</span>
    </div>

    <HackathonInlineTimeline
      v-if="hackathon"
      :hackathon="hackathon"
      :hackathon-id="Number($route.params.id)"
    />

    <HackApplication
      v-if="
        isAuthReady &&
        isMyHackathon &&
        authStore.roles.includes('ROLE_ORGANIZER')
      "
      :hackathon-id="Number($route.params.id)"
    />

    <p>
      <strong>Location:</strong> {{ hackathon.location || "Not specified" }}
    </p>
    <p>
      <strong>Prize fund:</strong> {{ hackathon.prizeFund || "Not specified" }}
    </p>
    <p>
      <strong>Conditions:</strong> {{ hackathon.conditions || "Not specified" }}
    </p>
    <div class="mb-3">
      <p><strong>Tags:</strong></p>
      <div v-if="hackathon.tags && hackathon.tags.length">
        <span
          v-for="(tag, index) in hackathon.tags"
          :key="index"
          class="badge rounded-pill bg-secondary me-2"
        >
          {{ tag.name }}
        </span>
      </div>
      <div v-else class="text-muted">No tags</div>
    </div>

    <div v-html="hackathon.description"></div>

    <!-- Таймлайн -->
    <div class="mt-5">
      <HackathonTimeline :hackathon-id="Number($route.params.id)" />
    </div>

    <ParticipantsTeamsPanel :hackathonId="Number($route.params.id)" />
  </div>

  <div v-else class="d-flex justify-content-center align-items-center mt-5">
    <div class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Loading hackathon's info...</p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/store/auth";
import HackathonTimeline from "@/components/HackathonTimeline.vue";
import HackathonInlineTimeline from "@/components/HackathonInlineTimeline.vue";
import HackApplication from "@/components/HackApplication.vue";
import ParticipantsTeamsPanel from "@/components/ParticipantsTeamsPanel.vue";
import api from "@/axios";

export default {
  name: "HackathonDetail",
  components: {
    HackathonTimeline,
    HackathonInlineTimeline,
    HackApplication,
    ParticipantsTeamsPanel,
  },
  data() {
    return {
      hackathon: null,
      judges: [],
      hasApplied: false,
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    isMyHackathon() {
      return (
        this.hackathon &&
        Number(this.hackathon.organizerId) === Number(this.authStore.userId)
      );
    },
    showRegisterBlock() {
      console.log("roles", this.authStore.roles);
      return (
        this.authStore.roles.includes("ROLE_PARTICIPANT") && !this.isMyHackathon
      );
    },
    isAuthReady() {
      return (
        this.authStore.userId !== null &&
        this.authStore.userId !== undefined &&
        Array.isArray(this.authStore.roles) &&
        this.authStore.roles.length > 0
      );
    },
  },
  mounted() {
    const hackathonId = this.$route.params.id;
    this.fetchHackathonDetails(hackathonId);
    this.fetchJudges(hackathonId);
    this.checkIfApplied();
  },
  methods: {
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

    async fetchHackathonDetails(id) {
      try {
        const response = await fetch(`http://localhost:8080/hackathons/${id}`);
        const data = await response.json();
        this.hackathon = data;
      } catch (error) {
        console.error("Ошибка при загрузке данных хакатона:", error);
      }
    },
    async deleteHackathon() {
      if (!confirm("Are you sure you want to delete this hackathon?")) return;

      try {
        const token = localStorage.getItem("token");
        const hackathonId = this.$route.params.id;

        const response = await fetch(
          `http://localhost:8080/hackathons/${hackathonId}`,
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
        this.$router.back(); // возвращаемся на предыдущую страницу
      } catch (error) {
        console.error("Ошибка при удалении:", error);
        alert("Error");
      }
    },
    async fetchJudges(id) {
      try {
        const token = localStorage.getItem("token"); // достаём токен
        const response = await fetch(
          `http://localhost:8080/hackathons/${id}/hack-judges`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Ошибка при получении судей");
        }
        const data = await response.json();
        this.judges = data;
      } catch (error) {
        console.error("Ошибка при загрузке судей:", error);
      }
    },

    editHackathon() {
      const id = this.$route.params.id;
      this.$router.push({ name: "EditHackathon", params: { id } });
    },

    async registerToHackathon() {
      try {
        const hackathonId = this.$route.params.id;
        const userId = this.authStore.userId;

        await api.post(`/hackathons/${hackathonId}/apply`, null, {
          params: { userId },
        });

        this.hasApplied = true; // показываем сообщение
      } catch (error) {
        console.error("Ошибка при регистрации:", error);
        alert("Ошибка: " + (error.response?.data?.message || error.message));
      }
    },

    async checkIfApplied() {
      try {
        const hackathonId = this.$route.params.id;
        const userId = this.authStore.userId;

        const response = await api.get(`/hackathons/${hackathonId}/applied`, {
          params: { userId },
        });

        console.log("check res:", response.data);
        this.hasApplied = response.data === true;
      } catch (error) {
        console.error("Ошибка при проверке заявки:", error);
      }
    },
  },
};
</script>

<style scoped>
.card {
  margin-top: 20px;
}
</style>
