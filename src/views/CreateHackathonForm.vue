<template>
  <div class="container mt-4">
    <h2>Создание хакатона</h2>
    <form @submit.prevent="createHackathon">
      <div class="mb-3">
        <label class="form-label">Название</label>
        <input type="text" class="form-control" v-model="form.name" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Описание</label>
        <textarea
          class="form-control"
          v-model="form.description"
          required
        ></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Статус</label>
        <select class="form-select" v-model="form.status" required>
          <option value="PLANNED">PLANNED</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="FINISHED">FINISHED</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Дата начала</label>
        <input
          type="datetime-local"
          class="form-control"
          v-model="form.start_date"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Дата окончания</label>
        <input
          type="datetime-local"
          class="form-control"
          v-model="form.end_date"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Тип</label>
        <select class="form-select" v-model="form.type" required>
          <option value="ONLINE">ONLINE</option>
          <option value="OFFLINE">OFFLINE</option>
          <option value="HYBRID">HYBRID</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Локация</label>
        <input type="text" class="form-control" v-model="form.location" />
      </div>

      <div class="mb-3">
        <label class="form-label">Тэги</label>
        <input type="text" class="form-control" v-model="form.tags" />
      </div>

      <div class="mb-3">
        <label class="form-label">Призовой фонд</label>
        <input type="number" class="form-control" v-model="form.prizeFund" />
      </div>

      <div class="mb-3">
        <label class="form-label">Условия</label>
        <textarea class="form-control" v-model="form.conditions"></textarea>
      </div>

      <button type="submit" class="btn btn-success">Создать</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "CreateHackathonForm",
  data() {
    return {
      form: {
        name: "",
        description: "",
        status: "PLANNED",
        start_date: "",
        end_date: "",
        type: "ONLINE",
        location: "",
        tags: "",
        prizeFund: null,
        conditions: "",
      },
    };
  },
  methods: {
    async createHackathon() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8080/hackathons/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(this.form),
          }
        );

        if (!response.ok) {
          throw new Error("Ошибка при создании хакатона");
        }

        const data = await response.json();
        this.$router.push(`/hackathons/${data.id}`);
      } catch (error) {
        console.error("Ошибка:", error);
        alert("Не удалось создать хакатон");
      }
    },
  },
};
</script>
