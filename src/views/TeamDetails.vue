<template>
  <div v-if="team.name && hackathon.name">
    <div class="container mt-4">
      <h2 class="mb-4">Team: {{ team.name }}</h2>
      <div class="mb-3">
        <!-- Кнопки -->
        <button
          v-if="isLeader"
          type="button"
          class="btn btn-outline-danger me-2"
          @click="deleteTeam"
        >
          Delete
        </button>

        <button
          v-if="isMember"
          type="button"
          class="btn btn-outline-danger"
          @click="leaveTeam"
        >
          Leave
        </button>
      </div>

      <div class="mb-4">
        <h5>Hackathon Info</h5>
        <p class="d-flex align-items-center">
          <strong class="me-2">{{ hackathon.name }}</strong>
          <router-link
            :to="{ name: 'HackathonDetail', params: { id: hackathon.id } }"
            class="btn btn-link p-0 text-decoration-none"
            title="View hackathon details"
          >
            <i class="bi bi-info-circle fs-5"></i>
          </router-link>
        </p>
        <p><strong>Organizer:</strong> {{ hackathon.organizerName }}</p>
      </div>

      <div class="mb-4">
        <h5>Team Leader</h5>
        <p>
          {{ leaderFullName }}
          <span class="text-muted">({{ team.leaderInfo.username }})</span>
          <span class="text-warning ms-2" title="Team Leader">★</span>
        </p>
      </div>

      <div>
        <h5>Team Members ({{ team.membersInfo.length }})</h5>
        <ul class="list-group">
          <li
            v-for="member in team.membersInfo"
            :key="member.id"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              {{ member.firstName }} {{ member.lastName }}
              <span class="text-muted">({{ member.username }})</span>
            </span>
            <span
              v-if="member.id === team.leaderInfo.id"
              class="text-warning"
              title="Team Leader"
              >★</span
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div v-else class="text-center my-5">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import api from "@/axios";
import { useAuthStore } from "@/store/auth";

const route = useRoute();
const teamId = route.params.id;

const team = ref({});
const hackathon = ref({});

const authStore = useAuthStore();
const currentUserId = computed(() => {
  return authStore.userId ? Number(authStore.userId) : null;
});

const fetchTeam = async () => {
  try {
    const response = await api.get(`/teams/${teamId}`);
    team.value = response.data.teamInfo;
    hackathon.value = response.data.hackathonInfo;
  } catch (error) {
    console.error("Failed to fetch team details:", error);
  }
};

const leaderFullName = computed(() => {
  if (!team.value?.leaderInfo) return "No leader";
  const { firstName, lastName } = team.value.leaderInfo;
  return `${firstName} ${lastName}`;
});

const isLeader = computed(() => {
  return team.value.leaderInfo?.id === currentUserId.value;
});

const isMember = computed(() => {
  if (!team.value.membersInfo || !currentUserId.value) return false;
  return (
    team.value.membersInfo.some((m) => m.id === currentUserId.value) &&
    !isLeader.value
  );
});

async function leaveTeam() {
  try {
    await api.post(`/teams/${teamId}/leave`);
    alert("You left the team");
    await fetchTeam();
  } catch (err) {
    alert(err.response?.data?.message || err.message);
  }
}

async function deleteTeam() {
  if (!confirm("Are you sure you want to delete the team?")) return;
  try {
    await api.delete(`/teams/${teamId}`);
    alert("Team deleted");
    this.$router.back();
  } catch (err) {
    alert(err.response?.data?.message || err.message);
  }
}

onMounted(async () => {
  await fetchTeam();
});
</script>
