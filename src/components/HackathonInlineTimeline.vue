<template>
  <div class="horizontal-timeline" v-if="hackathon">
    <!-- Старт -->
    <div class="timeline-node start">
      <div class="circle filled"></div>
      <div class="caption">
        <div class="label">{{ formattedHackDate(hackathon.startDate) }}</div>
        <div class="value">Start Date</div>
      </div>
    </div>

    <!-- Системные этапы -->
    <div
      v-for="phase in systemPhases"
      :key="phase.id"
      class="timeline-node middle"
    >
      <div class="circle small"></div>
      <div class="caption">
        <div class="label">{{ formatDate(phase.startTime) }}</div>
        <div class="value">{{ phase.name }}</div>
      </div>
    </div>

    <!-- Конец -->
    <div class="timeline-node end">
      <div class="circle filled"></div>
      <div class="caption">
        <div class="label">{{ formattedHackDate(hackathon.endDate) }}</div>
        <div class="value">End Date</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import api from "@/axios";

const props = defineProps({
  hackathon: Object,
  hackathonId: Number,
});

const phases = ref([]);
const systemPhases = computed(() => phases.value.filter((p) => p.isSystem));

onMounted(async () => {
  try {
    const response = await api.get(`/hackathons/${props.hackathonId}/phases`);
    phases.value = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке фаз:", error);
  }
});

function formatDate(dateArr) {
  if (!Array.isArray(dateArr)) return "??";
  const [y, m, d, h = 0, min = 0] = dateArr;
  const date = new Date(y, m - 1, d, h, min);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-EN", { month: "long" }); // май, июнь...
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${month}, ${hours}:${minutes}`;
}
function formattedHackDate(date) {
  if (!date) return "";
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleString("en-EN", { month: "long" }); // май, июнь...
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");

  return `${day} ${month}, ${hours}:${minutes}`;
}
</script>

<style scoped>
.horizontal-timeline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 2rem 1rem 0 1rem;
  gap: 1rem;
  margin-bottom: 2rem;
}

.horizontal-timeline::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #000;
  z-index: 0;
}

.timeline-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 80px;
}

.circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #555;
  z-index: 1;
  position: relative;
}

.circle.filled {
  width: 18px;
  height: 18px;
  background-color: #000;
}

.caption {
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.85rem;
  line-height: 1.3;
}

.label {
  font-weight: bold;
  font-size: 0.9rem;
}

.value {
  color: #555;
  font-size: 0.8rem;
}
</style>
