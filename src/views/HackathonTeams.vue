<template>
  <div class="container mt-4">
    <h2 class="mb-4">My Hackathon Teams</h2>

    <div class="accordion" id="hackathonAccordion">
      <div
        class="accordion-item"
        v-for="hackathon in hackathons"
        :key="hackathon.id"
      >
        <h2 class="accordion-header" :id="'heading-' + hackathon.id">
          <button
            class="accordion-button"
            :class="{ collapsed: !expandedHackathons.includes(hackathon.id) }"
            type="button"
            @click="toggleAccordion(hackathon.id)"
          >
            {{ hackathon.name }}
          </button>
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
            <ul v-else class="list-group">
              <li
                v-for="team in teamsByHackathon[hackathon.id]"
                :key="team.id"
                class="list-group-item"
              >
                <strong>{{ team.name }}</strong> — {{ team.leaderFullName }}
                <em>({{ team.membersAmount }} members)</em>
              </li>

              <li
                v-if="teamsByHackathon[hackathon.id]?.length === 0"
                class="list-group-item text-muted"
              >
                No teams created yet.
              </li>
            </ul>
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
