<template>
  <div class="container mt-4" v-if="hackathon">
    <h2>{{ hackathon.name }}</h2>
    <p class="text-muted">{{ hackathon.description }}</p>

    <div class="mb-3">
      <span class="badge text-bg-primary me-2">{{ hackathon.status }}</span>
      <span class="badge text-bg-secondary">{{ hackathon.type }}</span>
    </div>

    <p><strong>Дата начала:</strong> {{ formattedStartDate }}</p>
    <p><strong>Дата окончания:</strong> {{ formattedEndDate }}</p>
    <p><strong>Локация:</strong> {{ hackathon.location || "Не указана" }}</p>
    <p>
      <strong>Призовой фонд:</strong> {{ hackathon.prizeFund || "Не указан" }}
    </p>
    <p><strong>Условия:</strong> {{ hackathon.conditions || "Нет условий" }}</p>
    <p><strong>Тэги:</strong> {{ hackathon.tags || "Нет тэгов" }}</p>

    <!-- Блок судей -->
    <div class="mt-5">
      <h4>Судьи</h4>
      <div v-if="judges.length === 0" class="text-muted">
        Нет судей для этого хакатона.
      </div>
      <div v-else>
        <div
          class="card mb-3 p-3 shadow-sm"
          v-for="judge in judges"
          :key="judge.id"
        >
          <h5>{{ judge.firstName }} {{ judge.lastName }}</h5>
          <p class="mb-1"><strong>Username:</strong> {{ judge.username }}</p>
          <p class="mb-1"><strong>Компания:</strong> {{ judge.company }}</p>
          <p class="mb-1">
            <strong>Опыт работы:</strong> {{ judge.workExperience }} года
          </p>
          <p class="mb-0"><strong>О себе:</strong> {{ judge.bio }}</p>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="d-flex justify-content-center align-items-center mt-5">
    <div class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
      <p class="mt-3">Загрузка данных хакатона...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "HackathonDetail",
  data() {
    return {
      hackathon: null,
      judges: [],
    };
  },
  computed: {
    formattedStartDate() {
      return this.hackathon
        ? new Date(this.hackathon.startDate).toLocaleString()
        : "";
    },
    formattedEndDate() {
      return this.hackathon
        ? new Date(this.hackathon.endDate).toLocaleString()
        : "";
    },
  },
  mounted() {
    const hackathonId = this.$route.params.id;
    this.fetchHackathonDetails(hackathonId);
    this.fetchJudges(hackathonId);
  },
  methods: {
    async fetchHackathonDetails(id) {
      try {
        const response = await fetch(`http://localhost:8080/hackathons/${id}`);
        const data = await response.json();
        this.hackathon = data;
      } catch (error) {
        console.error("Ошибка при загрузке данных хакатона:", error);
      }
    },
    async fetchJudges(id) {
      try {
        const token = localStorage.getItem("token"); // достаём токен
        const response = await fetch(
          `http://localhost:8080/hackathons/${id}/hack-judges`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Ошибка при получении судей");
        }
        const data = await response.json();
        this.judges = data;
      } catch (error) {
        console.error("Ошибка при загрузке судей:", error);
      }
    },
  },
};
</script>

<style scoped>
.card {
  margin-top: 20px;
}
</style>
