<template>
  <div class="container mt-4">
    <h2>{{ isEditMode ? "Change hackathon info" : "Create hackathon" }}</h2>
    <form @submit.prevent="trySubmit" novalidate>
      <!-- Название -->
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input
          type="text"
          class="form-control"
          v-model="form.name"
          :class="{ 'is-invalid': submitted && !isNameValid }"
          required
          minlength="3"
          maxlength="100"
        />
        <div class="invalid-feedback">
          Hackathon name is required (must be between 3 and 100 char)
        </div>
      </div>

      <!-- Описание -->
      <div class="mb-3">
        <label class="form-label">Description</label>
        <quillEditor
          v-model:value="form.description"
          content-type="html"
          :modules="modules"
          style="min-height: 200px"
          class="bg-white"
          :class="{ 'is-invalid': submitted && !isDescriptionValid }"
        />
        <div class="invalid-feedback">
          Description must be at least 20 characters
        </div>
      </div>

      <!-- Статус и Тип на одной строке -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Status</label>
          <select class="form-select" v-model="form.status" required>
            <option value="PLANNED">PLANNED</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="FINISHED">FINISHED</option>
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">Type</label>
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
          <label class="form-label">Start Date</label>
          <input
            type="datetime-local"
            class="form-control"
            v-model="form.start_date"
            :class="{ 'is-invalid': submitted }"
            required
          />
          <div class="invalid-feedback">
            Start date is required and cannot be in the past
          </div>
        </div>
        <div class="col-md-6">
          <label class="form-label">End Date</label>
          <input
            type="datetime-local"
            class="form-control"
            v-model="form.end_date"
            :class="{ 'is-invalid': submitted }"
            required
          />
          <div class="invalid-feedback">
            End date is required and must be in the future
          </div>
        </div>
      </div>

      <!-- Локация -->
      <div class="mb-3">
        <label class="form-label">Location</label>
        <input type="text" class="form-control" v-model="form.location" />
      </div>

      <!-- Tags -->
      <TagSelect v-model="selectedTags" />

      <!-- Призовой фонд -->
      <div class="mb-3">
        <label class="form-label">Prize fund</label>
        <input
          type="number"
          step="0.01"
          class="form-control"
          v-model.number="form.prizeFund"
          :class="{ 'is-invalid': submitted && !isPrizeFundValid }"
          required
          min="0.01"
        />
        <div class="invalid-feedback">Prize fund must be greater than zero</div>
      </div>

      <!-- Условия -->
      <div class="mb-3">
        <label class="form-label">Conditions</label>
        <textarea
          class="form-control"
          v-model="form.conditions"
          :class="{ 'is-invalid': submitted && !isConditionsValid }"
          required
        ></textarea>
        <div class="invalid-feedback">Conditions are required</div>
      </div>

      <!-- Кнопка -->
      <button type="submit" class="btn btn-success">
        {{ isEditMode ? "Save changes" : "Create" }}
      </button>
    </form>
    <PhaseEditor :hackathonId="id" @phases-saved="onPhasesSaved" />
    <InviteJudgesPanel v-if="isEditMode" :hackathonId="Number(id)" />
  </div>
</template>

<script>
import TagSelect from "@/components/TagSelect.vue";
import InviteJudgesPanel from "@/components/InviteJudgesPanel.vue";
import PhaseEditor from "@/components/PhaseEditor.vue";
import { quillEditor } from "vue3-quill";
import Quill from "quill";
import "quill-emoji";

// Подключаем emoji в Quill (важно до использования Editor)
Quill.register("modules/emoji", require("quill-emoji").default);

export default {
  name: "CreateHackathon",
  components: {
    TagSelect,
    InviteJudgesPanel,
    quillEditor,
    PhaseEditor,
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

    isNameValid() {
      return (
        this.form.name &&
        this.form.name.length >= 3 &&
        this.form.name.length <= 100
      );
    },
    isDescriptionValid() {
      console.log("desc validation:", this.form.description);
      const div = document.createElement("div");
      div.innerHTML = this.form.description || "";
      const text = div.textContent || div.innerText || "";
      return text.trim().length >= 20;
    },
    //isStartDateValid() {
    //  if (!this.form.start_date) return false;
    //  const now = new Date();
    //  const start = new Date(this.form.start_date);
    //  return (
    //    start >= new Date(now.getFullYear(), now.getMonth(), now.getDate())
    //  );
    //},
    //isEndDateValid() {
    //  if (!this.form.end_date || !this.form.start_date) return false;
    //  const start = new Date(this.form.start_date);
    //  const end = new Date(this.form.end_date);
    //  const now = new Date();
    //  return end > start && end > now;
    //},
    isPrizeFundValid() {
      return typeof this.form.prizeFund === "number" && this.form.prizeFund > 0;
    },
    isConditionsValid() {
      return !!this.form.conditions && this.form.conditions.trim().length > 0;
    },
    isFormValid() {
      return (
        this.isNameValid &&
        this.isDescriptionValid &&
        //this.isStartDateValid &&
        //this.isEndDateValid &&
        this.isPrizeFundValid &&
        this.isConditionsValid
      );
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
      submitted: false,
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, { background: [] }],
          ["link", "blockquote", "code-block"],
          ["emoji"],
          ["clean"],
        ],
        emoji: true,
      },
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

        console.log("submit hack description:", this.form.description);

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

    async trySubmit() {
      this.submitted = true;
      if (!this.isFormValid) return;
      await this.submitHackathon();
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
