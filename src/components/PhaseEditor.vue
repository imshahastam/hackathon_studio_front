<template>
  <div>
    <h5>Phases</h5>

    <!-- Список фаз -->
    <div v-for="(phase, idx) in phases" :key="idx" class="card mb-2 p-2">
      <div class="row g-2 align-items-center">
        <div class="col-md-3">
          <input v-model="phase.name" class="form-control" placeholder="Name" />
        </div>
        <div class="col-md-3">
          <input
            v-model="phase.description"
            class="form-control"
            placeholder="Description"
          />
        </div>
        <div class="col-md-2">
          <select
            v-model="phase.type"
            class="form-select"
            @change="onTypeChange(phase)"
          >
            <option value="REGISTRATION">Registration</option>
            <option value="MEETUP">Meetup</option>
            <option value="SUBMISSION">Submission</option>
            <option value="JUDGING">Judging</option>
            <option value="ANNOUNCEMENT">Announcement</option>
            <option value="CUSTOM">Custom</option>
          </select>
        </div>
        <div class="col-md-2">
          <input
            v-model="phase.startTime"
            type="datetime-local"
            class="form-control"
          />
        </div>
        <div class="col-md-2">
          <input
            v-model="phase.endTime"
            type="datetime-local"
            class="form-control"
          />
        </div>
        <div class="col-auto d-flex align-items-center">
          <button class="btn btn-danger btn-sm" @click="removePhase(idx)">
            ×
          </button>
        </div>
      </div>
    </div>

    <button class="btn btn-outline-success my-2" @click="addPhase">
      + Add phase
    </button>
    <button class="btn btn-primary ms-2" @click="savePhases">
      Save Phases
    </button>
  </div>
</template>

<script>
import api from "@/axios";

export default {
  name: "PhasesEditor",
  props: {
    hackathonId: { type: [String, Number], required: true },
    // Можно не передавать initialPhases, будем сами подгружать!
  },
  data() {
    return {
      phases: [],
      loading: false,
      error: "",
    };
  },
  async mounted() {
    await this.loadPhases();
  },
  methods: {
    async loadPhases() {
      this.loading = true;
      this.error = "";
      try {
        const res = await api.get(`/hackathons/${this.hackathonId}/phases`);
        // если пришли строки — сразу заполни v-model
        this.phases = res.data.map((phase) => ({
          ...phase,
          startTime: this.fixDateForInput(phase.startTime),
          endTime: this.fixDateForInput(phase.endTime),
        }));
      } catch (e) {
        this.error = "Не удалось загрузить этапы";
        this.phases = [];
      } finally {
        this.loading = false;
      }
    },
    addPhase() {
      this.phases.push({
        name: "",
        description: "",
        type: "CUSTOM",
        startTime: "",
        endTime: "",
        isSystem: false,
      });
    },
    async removePhase(idx) {
      const phase = this.phases[idx];

      if (phase.id) {
        try {
          await api.delete(
            `/hackathons/${this.hackathonId}/phases/${phase.id}`
          );
          this.phases.splice(idx, 1);
        } catch (e) {
          alert(
            "Не удалось удалить этап: " +
              (e?.response?.data?.message || e.message)
          );
        }
      } else {
        this.phases.splice(idx, 1);
      }
    },
    onTypeChange(phase) {
      // system phases: isSystem всегда true
      const systemTypes = ["REGISTRATION", "SUBMISSION", "JUDGING"];
      phase.isSystem = systemTypes.includes(phase.type);
    },
    fixDateForInput(dt) {
      // Если дата приходит как '2025-06-01T00:00:00', а не '2025-06-01T00:00'
      if (!dt) return "";
      // обрезаем до минут, чтобы корректно отображалось в input type="datetime-local"
      return dt.length >= 16 ? dt.substring(0, 16) : dt;
    },
    async savePhases() {
      const phasesToSave = this.phases.map((phase) => ({
        ...phase,
        isSystem: ["REGISTRATION", "SUBMISSION", "JUDGING"].includes(
          phase.type
        ),
        startTime:
          phase.startTime.length === 16
            ? phase.startTime + ":00"
            : phase.startTime,
        endTime:
          phase.endTime.length === 16 ? phase.endTime + ":00" : phase.endTime,
      }));
      try {
        await api.put(`/hackathons/${this.hackathonId}/phases`, phasesToSave);
        alert("Phases saved!");
        await this.loadPhases();
      } catch (e) {
        console.log(phasesToSave);
        alert(
          "Ошибка при сохранении этапов: " +
            (e?.response?.data?.message || e.message)
        );
      }
    },
  },
};
</script>
