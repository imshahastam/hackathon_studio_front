<template>
  <div class="container mt-4">
    <h2>Создание хакатона</h2>
    <form @submit.prevent="submitHackathon">
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
            <option value="ACTIVE">ACTIVE</option>
            <option value="FINISHED">FINISHED</option>
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">Тип</label>
          <select class="form-select" v-model="form.type" required>
            <option value="ONLINE">ONLINE</option>
            <option value="OFFLINE">OFFLINE</option>
            <option value="HYBRID">HYBRID</option>
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

      <!-- Tags -->
      <TagSelect v-model="selectedTags" />

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
  <InviteJudgesPanel :hackathonId="Number(this.id)" />
</template>

<script>
import TagSelect from "@/components/TagSelect.vue";
import InviteJudgesPanel from "@/components/InviteJudgesPanel.vue";

export default {
  name: "CreateHackathon",
  components: {
    TagSelect,
    InviteJudgesPanel,
  },
  props: {
    id: {
      type: String,
      required: false,
    },
  },
  computed: {
    isEditMode() {
      return !!this.id;
    },
  },

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
        prizeFund: null,
        conditions: "",
      },
      selectedTags: [], // тэги из TagSelect
    };
  },
  async mounted() {
    if (this.isEditMode) {
      await this.loadHackathon(this.id);
    }
  },

  methods: {
    formatDateWithSeconds(datetime) {
      if (!datetime) return "";
      if (datetime.length === 19) return datetime;
      return datetime + ":00";
    },

    async submitHackathon() {
      try {
        const token = localStorage.getItem("token");

        const tagsId = this.selectedTags.filter((t) => t.id).map((t) => t.id);
        const newTags = this.selectedTags
          .filter((t) => !t.id)
          .map((t) => t.name);

        const payload = {
          ...this.form,
          start_date: this.formatDateWithSeconds(this.form.start_date),
          end_date: this.formatDateWithSeconds(this.form.end_date),
          tagsId,
          newTags,
        };

        const url = this.isEditMode
          ? `http://localhost:8080/hackathons/${this.id}/edit`
          : `http://localhost:8080/hackathons/create`;
        const method = this.isEditMode ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Ошибка при создании хакатона");

        const data = await response.json();
        this.$router.push(`/hackathons/${data.id}`);
      } catch (error) {
        console.error("Ошибка:", error);
        alert("Не удалось создать хакатон");
      }
    },

    async loadHackathon(id) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/hackathons/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        this.form.name = data.name;
        this.form.description = data.description;
        this.form.status = data.status;
        this.form.type = data.type;
        this.form.start_date = data.startDate.slice(0, 16); // формат datetime-local
        this.form.end_date = data.endDate.slice(0, 16);
        this.form.location = data.location;
        this.form.prizeFund = data.prizeFund;
        this.form.conditions = data.conditions;
        this.selectedTags = data.tags; // если tags — массив строк
      } catch (error) {
        console.error("Ошибка загрузки хакатона:", error);
      }
    },
  },
};
</script>
