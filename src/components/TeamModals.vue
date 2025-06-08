<template>
  <div>
    <!-- Create Team Modal -->
    <div
      v-if="showCreate"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create Team</h5>
            <button
              type="button"
              class="btn-close"
              @click="$emit('close-create')"
            ></button>
          </div>
          <div class="modal-body">
            <input
              type="text"
              v-model="newTeamName"
              class="form-control"
              placeholder="Team name"
            />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="$emit('close-create')">
              Cancel
            </button>
            <button class="btn btn-primary" @click="createTeam">Create</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Join Team Modal -->
    <div
      v-if="showJoin"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Join Team</h5>
            <button
              type="button"
              class="btn-close"
              @click="$emit('close-join')"
            ></button>
          </div>
          <div class="modal-body">
            <input
              type="text"
              v-model="teamSearch"
              class="form-control mb-3"
              placeholder="Search by name or ID"
            />
            <ul class="list-group">
              <li
                v-for="team in filteredTeams"
                :key="team.id"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <span
                  ><strong>{{ team.name }}</strong> (ID: {{ team.id }})</span
                >
                <button
                  class="btn btn-sm btn-success"
                  @click="joinTeam(team.id)"
                >
                  Join
                </button>
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="$emit('close-join')">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/axios";

export default {
  props: {
    hackathonId: {
      type: Number,
      required: true,
    },
    showCreate: Boolean,
    showJoin: Boolean,
    teams: Array,
  },
  data() {
    return {
      newTeamName: "",
      teamSearch: "",
    };
  },
  computed: {
    filteredTeams() {
      const query = this.teamSearch.toLowerCase();
      return this.teams.filter(
        (t) =>
          t.name.toLowerCase().includes(query) || String(t.id).includes(query)
      );
    },
  },
  methods: {
    async createTeam() {
      if (!this.newTeamName.trim()) return;
      try {
        await api.post(`/teams/create`, null, {
          params: {
            hackathonId: this.hackathonId,
            name: this.newTeamName,
          },
        });
        this.$emit("team-created");
        this.newTeamName = "";
        this.$emit("close-create");
      } catch (e) {
        console.error("Ошибка при создании команды", e);
      }
    },
    async joinTeam(teamId) {
      try {
        await api.post(`/teams/${teamId}/join`);
        this.$emit("team-joined");
        this.teamSearch = "";
        this.$emit("close-join");
      } catch (e) {
        console.error("Ошибка при присоединении к команде", e);
      }
    },
  },
};
</script>
