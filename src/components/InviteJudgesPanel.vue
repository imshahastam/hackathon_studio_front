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
      <div class="col-md-6 mb-4" v-for="judge in allJudges" :key="judge.id">
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
                <button
                  class="btn btn-outline-success btn-sm position-absolute top-0 end-0 m-2"
                  @click="inviteJudge(judge.id)"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InviteJudgesPanel",
  props: {
    hackathonId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      currentJudges: [],
      allJudges: [],
    };
  },
  mounted() {
    this.fetchCurrentJudges();
    this.fetchAllJudges();
  },
  methods: {
    async fetchCurrentJudges() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8080/hackathons/${this.hackathonId}/hack-judges`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        this.currentJudges = data;
      } catch (error) {
        console.error("Ошибка при загрузке текущих судей:", error);
      }
    },
    async fetchAllJudges() {
      try {
        const response = await fetch("http://localhost:8080/judges/all");
        const data = await response.json();
        this.allJudges = data;
      } catch (error) {
        console.error("Ошибка при загрузке всех судей:", error);
      }
    },
    async inviteJudge(judgeId) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8080/hackathons/${this.hackathonId}/invite-judge`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ judgeId }),
          }
        );

        if (!response.ok) {
          throw new Error("Error when sending the invitation");
        }

        alert("Invitation sended");
      } catch (error) {
        console.error("Error when sending the invitation:", error);
        alert("Couldn't send invitation");
      }
    },
  },
};
</script>

<style scoped>
.card {
  position: relative;
}
</style>
