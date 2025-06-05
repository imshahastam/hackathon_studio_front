<template>
  <div class="mt-5" v-if="applications.length">
    <h4>Pending Applications</h4>
    <div
      class="d-flex justify-content-between align-items-center border rounded p-3 mb-2"
      v-for="app in applications"
      :key="app.userId"
    >
      <div>{{ app.firstName }} {{ app.lastName }}</div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-success btn-sm" @click="approve(app.id)">
          <i class="bi bi-check2-square"></i>
        </button>
        <button class="btn btn-outline-danger btn-sm" @click="decline(app.id)">
          <i class="bi bi-ban"></i>
        </button>
      </div>
    </div>
  </div>
  <div v-else class="text-muted mt-5">No pending applications.</div>
</template>

<script>
import api from "@/axios";

export default {
  name: "HackathonApplications",
  props: ["hackathonId"],
  data() {
    return {
      applications: [],
    };
  },
  mounted() {
    this.loadApplications();
  },
  methods: {
    async loadApplications() {
      try {
        const response = await api.get(
          `/hackathons/${this.hackathonId}/applications`
        );
        this.applications = response.data;
        console.log("applications:", response.data);
      } catch (error) {
        console.error("Ошибка при загрузке заявок:", error);
      }
    },
    async approve(userId) {
      try {
        await api.post(
          `/hackathons/${this.hackathonId}/applications/${userId}/approve`
        );
        this.applications = this.applications.filter(
          (app) => app.userId !== userId
        );
      } catch (error) {
        console.error("Ошибка при одобрении заявки:", error);
      }
    },
    async decline(userId) {
      try {
        await api.post(
          `/hackathons/${this.hackathonId}/applications/${userId}/decline`
        );
        this.applications = this.applications.filter(
          (app) => app.userId !== userId
        );
      } catch (error) {
        console.error("Ошибка при отклонении заявки:", error);
      }
    },
  },
};
</script>

<style scoped>
button i {
  font-size: 1.2rem;
}
</style>
