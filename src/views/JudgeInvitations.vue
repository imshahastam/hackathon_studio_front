<template>
  <div class="container py-4">
    <h1 class="h4 mb-4">My invitations</h1>

    <div v-if="loading" class="text-muted">Loading...</div>
    <div v-else-if="invitations.length === 0" class="text-muted">
      You don't have invitations.
    </div>

    <div v-else class="d-grid gap-3">
      <div v-for="inv in invitations" :key="inv.id" class="card shadow-sm">
        <div class="card-body d-flex justify-content-between align-items-start">
          <div>
            <h5 class="card-title mb-2">{{ inv.hackathon.name }}</h5>
            <p class="mb-1"><strong>Type:</strong> {{ inv.hackathon.type }}</p>
            <p class="mb-1">
              <strong>Location:</strong> {{ inv.hackathon.location }}
            </p>
            <p class="mb-1">
              <strong>Start Date:</strong>
              {{ formatDate(inv.hackathon.startDate) }}
            </p>
            <p class="text-muted mb-0">
              <small>Received: {{ formatDateTime(inv.createdAt) }}</small>
            </p>
          </div>

          <div class="d-flex flex-column align-items-end gap-2 ms-3">
            <button
              class="btn btn-success btn-sm"
              @click="respondToInvitation(inv.id, 'ACCEPTED')"
            >
              Accept
            </button>
            <button
              class="btn btn-danger btn-sm"
              @click="openDeclineModal(inv.id)"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      class="modal fade show"
      tabindex="-1"
      style="display: block"
      v-if="showModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Are you sure?</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body text-center">
            <p>Do you really want to decline this invitation?</p>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="confirmDecline"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal backdrop -->
    <div v-if="showModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/axios";

const invitations = ref([]);
const loading = ref(true);
const showModal = ref(false);
const pendingDeclineId = ref(null);

onMounted(async () => {
  try {
    const { data } = await api.get("/judges/me/invitations");
    invitations.value = data;
  } catch (error) {
    console.error("Ошибка при загрузке приглашений:", error);
  } finally {
    loading.value = false;
  }
});

function formatDate(dateArray) {
  const [y, m, d, h = 0, min = 0] = dateArray;
  return new Date(y, m - 1, d, h, min).toLocaleString("en-EN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateTime(arr) {
  if (!arr) return "";
  const [y, m, d, h = 0, min = 0, s = 0] = arr;
  return new Date(y, m - 1, d, h, min, s).toLocaleString("en-EN");
}

function openDeclineModal(id) {
  pendingDeclineId.value = id;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  pendingDeclineId.value = null;
}

async function confirmDecline() {
  if (pendingDeclineId.value != null) {
    await respondToInvitation(pendingDeclineId.value, "DECLINED");
    closeModal();
  }
}

async function respondToInvitation(id, action) {
  try {
    await api.post(`/judges/invitations/${id}/respond`, { action });
    invitations.value = invitations.value.filter((inv) => inv.id !== id);
  } catch (error) {
    console.error("Ошибка при ответе на приглашение:", error);
  }
}
</script>
