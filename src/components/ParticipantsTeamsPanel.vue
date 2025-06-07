<template>
  <div class="mt-5">
    <!-- Табы -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === 'participants' }"
          href="#"
          @click.prevent="activeTab = 'participants'"
        >
          Participants
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === 'teams' }"
          href="#"
          @click.prevent="activeTab = 'teams'"
        >
          Teams
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === 'judges' }"
          href="#"
          @click.prevent="activeTab = 'judges'"
        >
          Judges
        </a>
      </li>
    </ul>

    <!-- Контент -->
    <div v-if="activeTab === 'participants'" class="mt-3">
      <h5>Participants</h5>
      <ul class="list-group">
        <li v-for="p in participants" :key="p.id" class="list-group-item">
          <strong>{{ p.fullName }}</strong> ({{ p.username }})
          <span v-if="p.teamName"> — Team: {{ p.teamName }}</span>
        </li>
      </ul>
    </div>

    <div v-if="activeTab === 'teams'" class="mt-3">
      <h5>Teams</h5>
      <ul class="list-group">
        <li v-for="team in teams" :key="team.id" class="list-group-item">
          <strong>{{ team.name }}</strong> — Leader: {{ team.leaderFullName }},
          {{ team.membersAmount }} member<span v-if="team.membersAmount !== 1"
            >s</span
          >
        </li>
      </ul>
    </div>

    <div v-if="activeTab === 'judges'" class="mt-3">
      <h5>Judges</h5>
      <ul class="list-group">
        <li v-for="j in judges" :key="j.id" class="list-group-item">
          <strong>{{ j.firstName }} {{ j.lastName }}</strong> ({{ j.username }})
          <span v-if="j.company"> — {{ j.company }}</span>
          <span v-if="j.workExperience">, {{ j.workExperience }} yrs exp</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from "@/axios";

export default {
  props: ["hackathonId"],
  data() {
    return {
      activeTab: "participants",
      participants: [],
      teams: [],
      judges: [],
    };
  },
  mounted() {
    this.fetchParticipants();
    this.fetchTeams();
    this.fetchJudges();
  },
  methods: {
    async fetchParticipants() {
      try {
        const res = await api.get(
          `/hackathons/${this.hackathonId}/participants`
        );
        this.participants = await res.data;
      } catch (e) {
        console.error("Ошибка загрузки участников", e);
      }
    },
    async fetchTeams() {
      try {
        const res = await api.get(`/teams/${this.hackathonId}/teams`);
        this.teams = await res.data;
      } catch (e) {
        console.error("Ошибка загрузки команд", e);
      }
    },
    async fetchJudges() {
      try {
        const res = await api.get(`hackathons/${this.hackathonId}/hack-judges`);
        this.judges = await res.data;
      } catch (e) {
        console.error("Ошибка загрузки судей", e);
      }
    },
  },
};
</script>
