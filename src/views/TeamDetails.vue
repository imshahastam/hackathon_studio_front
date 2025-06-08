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

      <div class="mt-4">
        <h5>Submission</h5>

        <div v-if="loadingSubmission" class="text-muted">
          Loading submission...
        </div>

        <div v-else-if="submission">
          <p>
            <strong>Frontend repo: </strong>
            <a :href="submission.frontendRepo" target="_blank">{{
              submission.frontendRepo
            }}</a>
          </p>
          <p>
            <strong>Backend repo: </strong>
            <a :href="submission.backendRepo" target="_blank">{{
              submission.backendRepo
            }}</a>
          </p>
          <p>
            <strong>Comment:</strong><br />
            {{ submission.comment }}
          </p>
          <p>
            <strong>Submitted at:</strong>
            {{ formatDate(submission.submittedAt) }}
          </p>
        </div>

        <div v-else>
          <p class="text-muted">No submission yet.</p>
          <button v-if="isLeader" class="btn btn-success" @click="goToSubmit">
            Submit work
          </button>
        </div>

        <!-- Modal -->
        <div
          class="modal fade"
          tabindex="-1"
          :class="{ show: showModal }"
          style="display: block"
          v-if="showModal"
          @click.self="closeModal"
        >
          <div class="modal-dialog">
            <form @submit.prevent="submitWork" class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Submit Your Work</h5>
                <button
                  type="button"
                  class="btn-close"
                  @click="closeModal"
                ></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label for="frontendRepo" class="form-label"
                    >Frontend Repo URL</label
                  >
                  <input
                    type="url"
                    id="frontendRepo"
                    v-model="form.frontendRepo"
                    class="form-control"
                    required
                    placeholder="https://github.com/your-frontend-repo"
                  />
                </div>
                <div class="mb-3">
                  <label for="backendRepo" class="form-label"
                    >Backend Repo URL</label
                  >
                  <input
                    type="url"
                    id="backendRepo"
                    v-model="form.backendRepo"
                    class="form-control"
                    required
                    placeholder="https://github.com/your-backend-repo"
                  />
                </div>
                <div class="mb-3">
                  <label for="comment" class="form-label">Comment</label>
                  <textarea
                    id="comment"
                    v-model="form.comment"
                    class="form-control"
                    rows="3"
                    placeholder="Any comments or description"
                  ></textarea>
                </div>
                <div v-if="submitError" class="alert alert-danger">
                  {{ submitError }}
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="closeModal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="submitting"
                >
                  {{ submitting ? "Submitting..." : "Submit" }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Modal backdrop -->
        <div v-if="showModal" class="modal-backdrop fade show"></div>
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

const submission = ref(null);
const loadingSubmission = ref(true);

const showModal = ref(false);
const submitting = ref(false);
const submitError = ref(null);

const form = ref({
  frontendRepo: "",
  backendRepo: "",
  comment: "",
});

const fetchSubmission = async () => {
  try {
    const response = await api.get(`/submissions/team/${teamId}`);
    submission.value = response.data;
  } catch (error) {
    // 404 = пока не отправлено — это ок
    if (error.response?.status !== 404) {
      console.error("Failed to fetch submission:", error);
    }
  } finally {
    loadingSubmission.value = false;
  }
};

function closeModal() {
  showModal.value = false;
  submitError.value = null;
  // очистить форму при закрытии (по желанию)
  form.value = {
    frontendRepo: "",
    backendRepo: "",
    comment: "",
  };
}

async function submitWork() {
  submitError.value = null;
  submitting.value = true;
  try {
    // Отправляем POST-запрос на API сабмита работы
    await api.post(`/submissions/team/${teamId}`, {
      frontendRepo: form.value.frontendRepo,
      backendRepo: form.value.backendRepo,
      comment: form.value.comment,
    });
    // После успешного сабмита обновляем данные сабмишна
    await fetchSubmission();
    closeModal();
  } catch (error) {
    submitError.value =
      error.response?.data?.message || "Failed to submit work.";
  } finally {
    submitting.value = false;
  }
}

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

function formatDate(array) {
  if (!array) return "";
  const [y, m, d, h, min] = array;
  return `${d.toString().padStart(2, "0")}.${m
    .toString()
    .padStart(2, "0")}.${y} ${h}:${min.toString().padStart(2, "0")}`;
}

const goToSubmit = () => {
  showModal.value = true;
};

onMounted(async () => {
  await fetchTeam();
  await fetchSubmission();
});
</script>
