<template>
  <div class="mt-5">
    <!-- Текущие судьи -->
    <h4>Hackathon's Judges</h4>
    <ul v-if="currentJudges.length" class="list-group mb-4">
      <li
        v-for="judge in currentJudges"
        :key="judge.id"
        class="list-group-item"
      >
        {{ judge.firstName }} {{ judge.lastName }}
      </li>
    </ul>
    <p v-else class="text-muted">There are no judges yet.</p>

    <!-- Приглашения -->
    <h4>Invite judges:</h4>
    <div class="row">
      <div
        class="col-md-6 mb-4"
        v-for="judge in availableJudges"
        :key="judge.id"
      >
        <div class="card h-100">
          <div class="row g-0">
            <div class="col-4 d-flex align-items-center justify-content-center">
              <img
                src="https://via.placeholder.com/100"
                class="img-fluid rounded-start"
                alt="Judge's photo"
              />
            </div>
            <div class="col-8">
              <div class="card-body position-relative">
                <h5 class="card-title">
                  {{ judge.firstName }} {{ judge.lastName }}
                </h5>
                <p class="mb-1">
                  <strong>Company:</strong> {{ judge.company }}
                </p>
                <p class="mb-1">
                  <strong>EXP:</strong> {{ judge.workExperience }}
                </p>
                <div class="mt-2">
                  <span
                    v-for="(tag, index) in judge.competences.slice(0, 3)"
                    :key="index"
                    class="badge bg-secondary me-1"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- Кнопка/иконка статуса -->
                <div class="position-absolute top-0 end-0 m-2">
                  <button
                    v-if="!pendingInvitations.has(judge.id)"
                    class="btn btn-outline-success btn-sm"
                    @click="inviteJudge(judge.id)"
                  >
                    +
                  </button>
                  <i
                    v-else
                    class="bi bi-hourglass-split text-warning fs-5"
                    title="Invitation sent, waiting"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import api from "@/axios";

export default {
  name: "InviteJudgesPanel",
  props: {
    hackathonId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const currentJudges = ref([]);
    const allJudges = ref([]);
    const pendingInvitations = ref(new Set());

    const fetchCurrentJudges = async () => {
      try {
        const response = await api.get(
          `/hackathons/${props.hackathonId}/hack-judges`
        );
        currentJudges.value = response.data;
      } catch (error) {
        console.error("Ошибка при загрузке текущих судей:", error);
      }
    };

    const fetchAllJudges = async () => {
      try {
        const response = await api.get("/judges/all");
        allJudges.value = response.data;
      } catch (error) {
        console.error("Ошибка при загрузке всех судей:", error);
      }
    };

    const fetchPendingInvitations = async () => {
      try {
        const response = await api.get(
          `/judges/${props.hackathonId}/invitations`
        );
        const data = response.data;

        const pending = data
          .filter((inv) => inv.status === "PENDING")
          .map((inv) => inv.judgeId);

        pendingInvitations.value = new Set(pending);
      } catch (error) {
        console.error("Ошибка при загрузке приглашений:", error);
      }
    };

    const inviteJudge = async (judgeId) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8080/hackathons/${props.hackathonId}/invite-judge`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ judgeId }),
          }
        );

        if (!response.ok) throw new Error("Error when sending the invitation");

        alert("Invitation sent");
        await fetchPendingInvitations(); // обновим статус
      } catch (error) {
        console.error("Error when sending the invitation:", error);
        alert("Couldn't send invitation");
      }
    };

    onMounted(() => {
      fetchCurrentJudges();
      fetchAllJudges();
      fetchPendingInvitations();
    });

    const availableJudges = computed(() => {
      const currentJudgeIds = new Set(currentJudges.value.map((j) => j.id));
      return allJudges.value.filter((judge) => !currentJudgeIds.has(judge.id));
    });

    return {
      currentJudges,
      allJudges,
      pendingInvitations,
      inviteJudge,
      availableJudges,
    };
  },
};
</script>

<style scoped>
.card {
  position: relative;
}
</style>
