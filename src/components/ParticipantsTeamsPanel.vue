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
        <li
          v-for="p in participants"
          :key="p.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <strong>{{ p.fullName }}</strong> ({{ p.username }})
            <span v-if="p.teamName"> — Team: {{ p.teamName }}</span>
          </div>
          <button
            v-if="canInvite && !p.teamName"
            class="btn btn-sm btn-outline-success"
            @click="inviteToTeam(p.username)"
          >
            Invite to team
          </button>
        </li>
      </ul>
    </div>

    <div v-if="activeTab === 'teams'" class="mt-3">
      <h5>Teams</h5>
      <div v-if="isRegistered">
        <button
          class="btn btn-primary btn-sm me-2"
          @click="showCreateModal = true"
        >
          Create Team
        </button>
        <button
          class="btn btn-outline-primary btn-sm"
          @click="showJoinModal = true"
        >
          Join Team
        </button>
      </div>
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

    <!-- Модалки -->
    <TeamModals
      :hackathonId="hackathonId"
      :showCreate="showCreateModal"
      :showJoin="showJoinModal"
      :teams="teams"
      @close-create="showCreateModal = false"
      @close-join="showJoinModal = false"
      @team-created="fetchTeams"
      @team-joined="handleTeamJoined"
    />
  </div>
</template>

<script>
import TeamModals from "./TeamModals.vue";
import api from "@/axios";

export default {
  components: {
    TeamModals,
  },
  props: ["hackathonId"],
  data() {
    return {
      activeTab: "participants",
      participants: [],
      teams: [],
      judges: [],
      showCreateModal: false,
      showJoinModal: false,
      myTeam: null,
    };
  },
  mounted() {
    this.fetchParticipants();
    this.fetchTeams();
    this.fetchJudges();
  },
  computed: {
    isRegistered() {
      const userId = Number(localStorage.getItem("userId"));
      console.log("participant:", this.participants);
      return Array.isArray(this.participants) &&
        this.participants.length &&
        userId
        ? this.participants.some((p) => p.id === userId)
        : false;
    },
    canInvite() {
      const userId = Number(localStorage.getItem("userId"));
      return (
        this.isRegistered && this.myTeam && this.myTeam.leaderId === userId
      );
    },
  },
  methods: {
    handleTeamJoined() {
      this.fetchParticipants();
      this.fetchTeams();
    },
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

        const userId = Number(localStorage.getItem("userId"));
        this.myTeam = this.teams.find((t) =>
          t.memberIds?.includes(Number(userId))
        );
        console.log("myTeam:", this.myTeam);
        console.log("teams:", this.teams.memberIds);
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

    async inviteToTeam(username) {
      try {
        await api.post(`/teams/${this.myTeam.id}/invite`, null, {
          params: { username },
        });
        alert(`Invitation sent to ${username}`);
      } catch (e) {
        console.error("Ошибка при отправке приглашения", e);
        alert(e.response?.data?.message || "Error inviting user");
      }
    },
  },
};
</script>
