<template>
  <div class="container mt-5">
    <h3 class="mb-4">Hackathon's Timeline</h3>
    <div class="timeline">
      <div v-for="phase in phases" :key="phase.id" class="timeline-item">
        <div class="timeline-status">
          {{ statusText(getPhaseStatus(phase)) }}
        </div>
        <div class="timeline-marker" :class="getPhaseStatus(phase)"></div>
        <div class="timeline-content">
          <div class="timeline-date">{{ formatDate(phase.startTime) }}</div>
          <div class="timeline-title">{{ phase.name }}</div>
          <div class="text-muted">{{ phase.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api from "@/axios";

const props = defineProps({
  hackathonId: Number,
});

const phases = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await api.get(`/hackathons/${props.hackathonId}/phases`);
    phases.value = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке фаз:", error);
  } finally {
    loading.value = false;
  }
});

function getPhaseStatus(phase) {
  const now = new Date();
  const [sy, sm, sd, sh = 0, smin = 0] = phase.startTime;
  const [ey, em, ed, eh = 0, emin = 0] = phase.endTime;

  const start = new Date(sy, sm - 1, sd, sh, smin);
  const end = new Date(ey, em - 1, ed, eh, emin);
  if (now < start) return "NOT_STARTED";
  if (now >= start && now < end) return "ACTIVE";
  return "FINISHED";
}

function formatDate(dateArr) {
  if (!Array.isArray(dateArr)) return "??";
  const [year, month, day, hour, minute] = dateArr;
  const date = new Date(year, month - 1, day, hour || 0, minute || 0);
  const n_day = date.getDate().toString().padStart(2, "0");
  const n_month = date.toLocaleString("en-EN", { month: "long" }); // май, июнь...
  const n_hours = date.getHours().toString().padStart(2, "0");
  const n_minutes = date.getMinutes().toString().padStart(2, "0");

  return `${n_day} ${n_month}, ${n_hours}:${n_minutes}`;
}

function statusText(status) {
  switch (status) {
    case "NOT_STARTED":
      return "Not started";
    case "ACTIVE":
      return "In progress";
    case "FINISHED":
      return "Finished";
    default:
      return "";
  }
}
</script>

<style scoped>
.timeline {
  border-left: 2px solid #333;
  padding-left: 2rem;
  margin-left: 8rem;
  position: relative;
}

.timeline-item {
  position: relative;
  margin-bottom: 2.5rem;
  padding-left: 0.7rem;
}

.timeline-marker {
  position: absolute;
  left: -2.4rem;
  top: 0.3rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: gray;
}

.timeline-marker.active {
  background-color: orange;
}

.timeline-marker.not-started {
  background-color: gray;
}

.timeline-marker.finished {
  background-color: green;
}

.timeline-status {
  position: absolute;
  left: -8.2rem;
  top: 0.2rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: lowercase;
  color: #666;
  width: 5rem;
  text-align: left;
}

.timeline-content {
  margin-left: 0.5rem;
}

.timeline-title {
  font-weight: 600;
  font-size: 1.05rem;
}

.timeline-date {
  font-weight: 600;
  color: #333;
}
</style>
