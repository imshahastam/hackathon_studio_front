<template>
  <div class="container mt-4">
    <h2 class="mb-4">My Hackathon Teams</h2>

    <div class="accordion" id="hackathonAccordion">
      <div
        class="accordion-item"
        v-for="hackathon in hackathons"
        :key="hackathon.id"
      >
        <h2 :id="'heading-' + hackathon.id" class="accordion-header">
          <div class="d-flex justify-content-between align-items-center w-100">
            <button
              class="accordion-button flex-grow-1 me-2"
              :class="{ collapsed: !expandedHackathons.includes(hackathon.id) }"
              type="button"
              @click="toggleAccordion(hackathon.id)"
            >
              {{ hackathon.name }}
            </button>

            <router-link
              :to="{ name: 'HackathonDetail', params: { id: hackathon.id } }"
              class="btn btn-link p-0 text-decoration-none m-4"
              title="Hackathon details"
              @click.stop
            >
              <i class="bi bi-info-circle fs-5"></i>
            </router-link>
          </div>
        </h2>
        <div
          :id="'collapse-' + hackathon.id"
          class="accordion-collapse"
          :aria-labelledby="'heading-' + hackathon.id"
          v-show="expandedHackathons.includes(hackathon.id)"
        >
          <div class="accordion-body">
            <div v-if="loadingHackathonId === hackathon.id" class="text-muted">
              Loading teams...
            </div>

            <div v-else>
              <table
                v-if="teamsByHackathon[hackathon.id]?.length"
                class="table table-bordered table-hover"
              >
                <thead>
                  <tr>
                    <th>Team Name</th>
                    <th>Leader</th>
                    <th>Members</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="team in teamsByHackathon[hackathon.id]"
                    :key="team.id"
                  >
                    <td>
                      <router-link
                        :to="{ name: 'TeamDetails', params: { id: team.id } }"
                        class="team-link"
                        title="Team's details"
                      >
                        {{ team.name }}
                      </router-link>
                    </td>
                    <td>{{ team.leaderFullName }}</td>
                    <td>{{ team.membersAmount }}</td>
                  </tr>
                </tbody>
              </table>

              <div
                v-if="teamsByHackathon[hackathon.id]?.length === 0"
                class="text-muted"
              >
                No teams created yet.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/axios";

const hackathons = ref([]);
const teamsByHackathon = ref({});
const loadingHackathonId = ref(null);
const expandedHackathons = ref([]);

const fetchHackathons = async () => {
  try {
    const response = await api.get("/hackathons/my");
    hackathons.value = response.data;
  } catch (error) {
    console.error("Ошибка при получении хакатонов:", error);
  }
};

const toggleAccordion = async (hackathonId) => {
  const index = expandedHackathons.value.indexOf(hackathonId);
  if (index > -1) {
    expandedHackathons.value.splice(index, 1);
  } else {
    expandedHackathons.value.push(hackathonId);

    if (!teamsByHackathon.value[hackathonId]) {
      loadingHackathonId.value = hackathonId;
      try {
        const response = await api.get(`/teams/hackathon/${hackathonId}`);
        teamsByHackathon.value[hackathonId] = response.data;
        console.log(response.data);
      } catch (error) {
        console.error(
          `Ошибка при получении команд для хакатона ${hackathonId}:`,
          error
        );
        teamsByHackathon.value[hackathonId] = [];
      } finally {
        loadingHackathonId.value = null;
      }
    }
  }
};

onMounted(fetchHackathons);
</script>

<style scoped>
.table th {
  background-color: #f8f9fa;
}
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
