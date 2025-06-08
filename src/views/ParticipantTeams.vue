<template>
  <div class="container mt-4">
    <!-- Invitations Block -->
    <div class="mb-4">
      <h4 class="mb-3">My invitations</h4>
      <div v-if="invitations.length === 0" class="text-muted">
        You have no invitations.
      </div>

      <div v-for="inv in invitations" :key="inv.id" class="card mb-2">
        <div
          class="card-header d-flex justify-content-between align-items-center"
        >
          <span
            @click="toggleInvitation(inv.id)"
            class="invitation-toggle"
            style="cursor: pointer"
          >
            You have been invited to <strong>{{ inv.teamInfo.name }}</strong>
          </span>
          <div>
            <i
              class="bi bi-check-circle text-success me-3"
              style="cursor: pointer"
              @click="acceptInvitation(inv.id)"
            ></i>
            <i
              class="bi bi-x-circle text-danger"
              style="cursor: pointer"
              @click="declineInvitation(inv.id)"
            ></i>
          </div>
        </div>

        <div v-if="expandedInvitationId === inv.id" class="card-body">
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              {{ inv.teamInfo.leaderInfo.firstName }}
              {{ inv.teamInfo.leaderInfo.lastName }}
              <span class="badge bg-primary">Leader</span>
            </li>
            <li
              v-for="member in getNonLeaderMembers(inv)"
              :key="member.id"
              class="list-group-item"
            >
              {{ member.firstName }} {{ member.lastName }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <h4 class="mb-4">My teams</h4>
    <!-- My Teams -->
    <div v-if="loading" class="text-center text-muted">Loading teams...</div>

    <div v-else>
      <div v-if="teams.length === 0" class="text-muted">
        You have not have teams.
      </div>

      <div v-for="item in teams" :key="item.teamInfo.id" class="card mb-3">
        <div class="card-header">
          <strong>
            <router-link
              :to="{ name: 'TeamDetails', params: { id: item.teamInfo.id } }"
              class="team-link"
              title="Team's details"
            >
              {{ item.teamInfo.name }}
            </router-link>
          </strong>
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
import { toast } from "vue3-toastify";

const teams = ref([]);
const invitations = ref([]);
const expandedInvitationId = ref([]);
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

const fetchInvitations = async () => {
  try {
    const response = await api.get("/teams/invitations");
    invitations.value = response.data;
  } catch (error) {
    console.error("Ошибка при получении приглашений:", error);
  }
};

const toggleInvitation = (id) => {
  expandedInvitationId.value = expandedInvitationId.value === id ? null : id;
};

const acceptInvitation = async (invitationId) => {
  try {
    await api.post(`/teams/invitations/${invitationId}/respond?accept=true`);
    invitations.value = invitations.value.filter(
      (inv) => inv.id !== invitationId
    );
    toast.success("Invitation accepted");
  } catch (error) {
    console.error("Ошибка при принятии приглашения:", error);
    toast.error("Failed to accept invitation");
  }
};

const declineInvitation = async (invitationId) => {
  try {
    await api.post(`/teams/invitations/${invitationId}/respond?accept=false`);
    invitations.value = invitations.value.filter(
      (inv) => inv.id !== invitationId
    );
    toast.success("Invitation declined");
  } catch (error) {
    console.error("Ошибка при отклонении приглашения:", error);
    toast.error("Failed to decline invitation");
  }
};

const getNonLeaderMembers = (invitation) => {
  return invitation.teamInfo.membersInfo.filter(
    (member) => member.id !== invitation.teamInfo.leaderInfo.id
  );
};

onMounted(() => {
  fetchTeams();
  fetchInvitations();
});
</script>

<style scoped>
.team-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.team-link:hover {
  color: #0d6efd;
  text-decoration: underline;
  cursor: pointer;
}

.invitation-toggle:hover {
  text-decoration: underline;
}
</style>
