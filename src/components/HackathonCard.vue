<template>
  <div class="col-12 mb-4">
    <div class="card mb-3">
      <div class="row g-0">
        <!-- Информация о хакатоне слева -->
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">{{ hackathon.name }}</h5>
            <div class="mb-2">
              <!-- Статус и тип в виде badges -->
              <span class="badge" :class="statusBadgeClass">{{
                hackathon.status
              }}</span>
              <span class="badge" :class="typeBadgeClass">{{
                hackathon.type
              }}</span>
            </div>
            <p class="card-text">
              <strong>Prize Fund:</strong>
              {{ hackathon.prizeFund ? `$${hackathon.prizeFund}` : "N/A" }}
            </p>
            <p class="card-text">
              <strong>Start Date:</strong>
              {{ formatDate(hackathon.startDate) }} -
              <strong>End Date:</strong> {{ formatDate(hackathon.endDate) }}
            </p>
            <p class="card-text">
              <strong>Location:</strong> {{ hackathon.location || "N/A" }}
            </p>
            <p class="card-text">
              <strong>Organizer:</strong> Organizer {{ hackathon.organizerId }}
            </p>
            <p class="card-text">
              <small class="text-muted"
                >Tags: {{ hackathon.tags.join(", ") || "N/A" }}</small
              >
            </p>
          </div>
        </div>

        <!-- Изображение хакатона справа -->
        <div class="col-md-4">
          <img
            :src="hackathon.imageUrl || defaultImage"
            class="img-fluid rounded-end"
            alt="Hackathon Image"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HackathonCard",
  props: {
    hackathon: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      defaultImage: "https://via.placeholder.com/150",
    };
  },
  computed: {
    statusBadgeClass() {
      switch (this.hackathon.status) {
        case "ACTIVE":
          return "text-bg-success"; // Зеленый для активных
        case "PLANNED":
          return "text-bg-warning"; // Желтый для запланированных
        default:
          return "text-bg-secondary"; // Серый для других статусов
      }
    },
    typeBadgeClass() {
      switch (this.hackathon.type) {
        case "ONLINE":
          return "text-bg-info"; // Голубой для онлайн
        case "OFFLINE":
          return "text-bg-danger"; // Красный для оффлайн
        default:
          return "text-bg-dark"; // Темный для других типов
      }
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
};
</script>

<style scoped>
.card {
  height: auto; /* Убираем фиксированную высоту */
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.card-text {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
</style>
