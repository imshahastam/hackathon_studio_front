<template>
  <div class="container mt-5" style="max-width: 500px">
    <h2 class="mb-4">Sign up</h2>
    <form @submit.prevent="submitRegistration">
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input
          v-model="form.username"
          type="text"
          class="form-control"
          required
          minlength="3"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input
          v-model="form.password"
          type="password"
          class="form-control"
          required
          minlength="6"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">First name</label>
        <input
          v-model="form.first_name"
          type="text"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Last name</label>
        <input
          v-model="form.last_name"
          type="text"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Roles</label>
        <div class="form-check" v-for="role in allRoles" :key="role">
          <input
            class="form-check-input"
            type="checkbox"
            :id="'role-' + role"
            :value="role"
            v-model="form.roles"
          />
          <label class="form-check-label" :for="'role-' + role">
            {{ role }}
          </label>
        </div>
        <div
          v-if="submitted && form.roles.length === 0"
          class="text-danger small"
        >
          Please select at least one role.
        </div>
      </div>

      <!-- Доп. блок для судьи -->
      <div v-if="form.roles.includes('JUDGE')" class="card p-3 mb-3 bg-light">
        <div class="mb-2">
          <label class="form-label">Company</label>
          <input
            v-model="form.judge.company"
            type="text"
            class="form-control"
          />
        </div>
        <div class="mb-2">
          <label class="form-label">Work experience (years)</label>
          <input
            v-model.number="form.judge.workExperience"
            type="number"
            class="form-control"
            min="0"
          />
        </div>
        <div class="mb-2">
          <label class="form-label">Bio</label>
          <textarea v-model="form.judge.bio" class="form-control"></textarea>
        </div>
        <div class="mb-2">
          <label class="form-label">LinkedIn</label>
          <input
            v-model="form.judge.linkedin"
            type="url"
            class="form-control"
          />
        </div>

        <!-- competences -->
        <TagSelect v-model="selectedTags" />
      </div>

      <button class="btn btn-success" type="submit">Register</button>
      <div v-if="errorMsg" class="alert alert-danger mt-3">{{ errorMsg }}</div>
      <div v-if="successMsg" class="alert alert-success mt-3">
        {{ successMsg }}
      </div>
    </form>
  </div>
</template>

<script>
import TagSelect from "@/components/TagSelect.vue";

export default {
  name: "RegistrationForm",
  components: {
    TagSelect,
  },
  data() {
    return {
      form: {
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        roles: [],
        judge: {
          company: "",
          workExperience: null,
          bio: "",
          linkedin: "",
          tagsId: [],
          newTags: [],
        },
      },
      selectedTags: [],
      allRoles: ["ORGANIZER", "JUDGE", "PARTICIPANT"],
      submitted: false,
      errorMsg: "",
      successMsg: "",
    };
  },
  watch: {
    selectedTags: {
      handler(newTags) {
        this.form.judge.tagsId = newTags.filter((t) => t.id).map((t) => t.id);
        this.form.judge.newTags = newTags
          .filter((t) => !t.id)
          .map((t) => t.name);
      },
      deep: true,
    },
  },
  methods: {
    async submitRegistration() {
      this.submitted = true;
      this.errorMsg = "";
      this.successMsg = "";

      // Basic frontend validation
      if (
        !this.form.username ||
        !this.form.password ||
        !this.form.first_name ||
        !this.form.last_name ||
        this.form.roles.length === 0
      ) {
        this.errorMsg =
          "Please fill in all fields and select at least one role.";
        return;
      }

      try {
        const formToSend = { ...this.form };
        if (!formToSend.roles.includes("JUDGE")) {
          delete formToSend.judge;
        }
        const response = await fetch(
          "http://localhost:8080/users/registration",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formToSend),
          }
        );

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || "Registration failed");
        }
        this.successMsg = "Registration successful! You can now log in.";
        // Optionally, clear form
        this.form.username = "";
        this.form.password = "";
        this.form.first_name = "";
        this.form.last_name = "";
        this.form.roles = [];
        this.submitted = false;
        this.form.judge = {
          company: "",
          workExperience: null,
          bio: "",
          linkedin: "",
          tagsId: [],
          newTags: [],
        };
        this.selectedTags = [];
      } catch (err) {
        this.errorMsg = err.message;
      }
    },
  },
};
</script>
