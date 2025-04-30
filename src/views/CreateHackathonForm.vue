<template>
  <div class="container mt-4">
    <h2>Создание хакатона</h2>
    <form @submit.prevent="createHackathon">
      <!-- Название -->
      <div class="mb-3">
        <label class="form-label">Название</label>
        <input type="text" class="form-control" v-model="form.name" required />
      </div>

      <!-- Описание -->
      <div class="mb-3">
        <label class="form-label">Описание</label>
        <textarea
          class="form-control"
          v-model="form.description"
          required
        ></textarea>
      </div>

      <!-- Статус и Тип на одной строке -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Статус</label>
          <select class="form-select" v-model="form.status" required>
            <option value="PLANNED">PLANNED</option>
            <option value="ONGOING">ACTIVE</option>
            <option value="FINISHED">FINISHED</option>
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">Тип</label>
          <select class="form-select" v-model="form.type" required>
            <option value="ONLINE">ONLINE</option>
            <option value="OFFLINE">OFFLINE</option>
            <option value="OFFLINE">HYBRID</option>
          </select>
        </div>
      </div>

      <!-- Дата начала и окончания на одной строке -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Дата начала</label>
          <input
            type="datetime-local"
            class="form-control"
            v-model="form.start_date"
            required
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Дата окончания</label>
          <input
            type="datetime-local"
            class="form-control"
            v-model="form.end_date"
            required
          />
        </div>
      </div>

      <!-- Локация -->
      <div class="mb-3">
        <label class="form-label">Локация</label>
        <input type="text" class="form-control" v-model="form.location" />
      </div>

      <!-- Тэги (мультивыбор по ID) -->
      <div class="mb-3">
        <label class="form-label">Тэги</label>
        <select class="form-select" multiple v-model="form.tagsId">
          <option v-for="tag in availableTags" :key="tag.id" :value="tag.id">
            {{ tag.name }}
          </option>
        </select>
      </div>

      <!-- Призовой фонд -->
      <div class="mb-3">
        <label class="form-label">Призовой фонд</label>
        <input type="number" class="form-control" v-model="form.prizeFund" />
      </div>

      <!-- Условия -->
      <div class="mb-3">
        <label class="form-label">Условия</label>
        <textarea class="form-control" v-model="form.conditions"></textarea>
      </div>

      <!-- Кнопка -->
      <button type="submit" class="btn btn-success">Создать</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "CreateHackathon",
  data() {
    return {
      form: {
        name: "",
        description: "",
        status: "PLANNED",
        type: "ONLINE",
        start_date: "",
        end_date: "",
        location: "",
        tagsId: [],
        prizeFund: null,
        conditions: "",
      },
      availableTags: [
        { id: 1, name: "AI" },
        { id: 2, name: "Design" },
        { id: 3, name: "Security" },
        { id: 4, name: "Data" },
        { id: 5, name: "Frontend" },
      ],
    };
  },
  methods: {
    formatDateWithSeconds(datetime) {
      if (!datetime) return "";
      // Если уже есть секунды — не трогаем
      if (datetime.length === 19) return datetime;
      return datetime + ":00"; // Добавляем секунды вручную
    },

    async createHackathon() {
      try {
        const token = localStorage.getItem("token");

        const payload = {
          ...this.form,
          start_date: this.formatDateWithSeconds(this.form.start_date),
          end_date: this.formatDateWithSeconds(this.form.end_date),
        };

        const response = await fetch(
          "http://localhost:8080/hackathons/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error("Ошибка при создании хакатона");
        }

        const data = await response.json();
        this.$router.push(`/hackathons/${data.id}`);
      } catch (error) {
        console.error("Ошибка:", error);
        console.log("Request body:", JSON.stringify(this.form, null, 2));

        alert("Не удалось создать хакатон");
      }
    },
  },
};
</script>
