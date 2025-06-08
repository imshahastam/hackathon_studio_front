<template>
  <div class="container mt-4">
    <h5 class="mb-4">My Hackathon Judges</h5>

    <div class="accordion" id="hackathonAccordion">
      <div
        class="accordion-item"
        v-for="hackathon in hackathons"
        :key="hackathon.id"
      >
        <h2 :id="'heading-' + hackathon.id" class="accordion-header">
          <div class="d-flex justify-content-between align-items-center w-100">
            <button
              class="accordion-button flex-grow-1 me-2"
              :class="{ collapsed: !expandedHackathons.includes(hackathon.id) }"
              type="button"
              @click="toggleAccordion(hackathon.id)"
            >
              {{ hackathon.name }}
            </button>

            <router-link
              :to="{ name: 'HackathonDetail', params: { id: hackathon.id } }"
              class="btn btn-link p-0 text-decoration-none m-4"
              title="Hackathon details"
              @click.stop
            >
              <i class="bi bi-info-circle fs-5"></i>
            </router-link>
          </div>
        </h2>

        <div
          :id="'collapse-' + hackathon.id"
          class="accordion-collapse"
          :aria-labelledby="'heading-' + hackathon.id"
          v-show="expandedHackathons.includes(hackathon.id)"
        >
          <div class="accordion-body">
            <div v-if="loadingHackathonId === hackathon.id" class="text-muted">
              Loading judges...
            </div>

            <div v-else>
              <table
                v-if="judgesByHackathon[hackathon.id]?.length"
                class="table table-bordered table-hover"
              >
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Experience (years)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="judge in judgesByHackathon[hackathon.id]"
                    :key="judge.id"
                  >
                    <td>
                      <router-link
                        :to="{
                          name: 'JudgeProfile',
                          params: { id: judge.userId },
                        }"
                        class="judge-link"
                        title="Judge profile"
                      >
                        {{ judge.firstName }} {{ judge.lastName }}
                      </router-link>
                    </td>
                    <td>{{ judge.company }}</td>
                    <td>{{ judge.workExperience }}</td>
                    <td>
                      <span v-html="getStatusBadge(judge.status)"></span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div
                v-if="judgesByHackathon[hackathon.id]?.length === 0"
                class="text-muted"
              >
                No judges yet.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/axios";

const hackathons = ref([]);
const judgesByHackathon = ref({});
const loadingHackathonId = ref(null);
const expandedHackathons = ref([]);

const fetchHackathons = async () => {
  try {
    const response = await api.get("/hackathons/my");
    hackathons.value = response.data;
  } catch (error) {
    console.error("Error fetching hackathons:", error);
  }
};

const toggleAccordion = async (hackathonId) => {
  const index = expandedHackathons.value.indexOf(hackathonId);
  if (index > -1) {
    expandedHackathons.value.splice(index, 1);
  } else {
    expandedHackathons.value.push(hackathonId);

    if (!judgesByHackathon.value[hackathonId]) {
      loadingHackathonId.value = hackathonId;

      try {
        const [judgesRes, statusRes] = await Promise.all([
          api.get(`/hackathons/${hackathonId}/hack-judges`),
          api.get(`/judges/${hackathonId}/invitations`),
        ]);

        const statuses = statusRes.data.reduce((map, invite) => {
          map[invite.judgeId] = invite.status;
          return map;
        }, {});

        const mergedJudges = judgesRes.data.map((j) => ({
          ...j,
          status: statuses[j.id] || "PENDING",
        }));

        judgesByHackathon.value[hackathonId] = mergedJudges;
      } catch (error) {
        console.error(
          `Error fetching judges for hackathon ${hackathonId}:`,
          error
        );
        judgesByHackathon.value[hackathonId] = [];
      } finally {
        loadingHackathonId.value = null;
      }
    }
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case "ACCEPTED":
      return '<span class="badge rounded-pill bg-success">ACCEPTED</span>';
    case "DECLINED":
      return '<span class="badge rounded-pill bg-danger">DECLINED</span>';
    case "PENDING":
    default:
      return '<span class="badge rounded-pill bg-warning text-dark">PENDING</span>';
  }
};

onMounted(fetchHackathons);
</script>

<style scoped>
.judge-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.judge-link:hover {
  color: #0d6efd;
  text-decoration: underline;
  cursor: pointer;
}
</style>
