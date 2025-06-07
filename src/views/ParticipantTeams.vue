<template>
  <div class="container mt-4">
    <h2 class="mb-4">My teams</h2>

    <div v-if="loading" class="text-center text-muted">Loading teams...</div>

    <div v-else>
      <div v-if="teams.length === 0" class="text-muted">
        You have not have teams.
      </div>

      <div v-for="item in teams" :key="item.teamInfo.id" class="card mb-3">
        <div class="card-header">
          <strong
            ><router-link
              :to="{ name: 'TeamDetails', params: { id: item.teamInfo.id } }"
              class="team-link"
              title="Team's details"
              >{{ item.teamInfo.name }}</router-link
            ></strong
          >
          <small class="text-muted ms-2">
            [ {{ item.teamInfo.membersInfo.length }} members ]
          </small>
        </div>
        <div class="card-body">
          <p>
            <strong>Leader:</strong>
            {{ item.teamInfo.leaderInfo.firstName }}
            {{ item.teamInfo.leaderInfo.lastName }} (<em
              >@{{ item.teamInfo.leaderInfo.username }}</em
            >)
          </p>

          <p><strong>Members:</strong></p>
          <ul class="list-group mb-3">
            <li
              v-for="member in item.teamInfo.membersInfo"
              :key="member.id"
              class="list-group-item p-1"
            >
              {{ member.firstName }} {{ member.lastName }} (<em
                >@{{ member.username }}</em
              >)
            </li>
          </ul>

          <p class="mb-0">
            <strong>Hackathon:</strong> {{ item.hackathonInfo.name }}<br />
            <strong>Organizer:</strong> {{ item.hackathonInfo.organizerName }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/axios";

const teams = ref([]);
const loading = ref(false);

const fetchTeams = async () => {
  loading.value = true;
  try {
    const response = await api.get("/teams/my");
    teams.value = response.data;
  } catch (error) {
    console.error("Ошибка при получении команд:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchTeams);
</script>
<style scoped>
.team-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.team-link:hover {
  color: #0d6efd; /* Bootstrap синий */
  text-decoration: underline;
  cursor: pointer;
}
</style>
