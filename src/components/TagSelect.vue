<!-- TagSelect.vue -->
<template>
  <div class="mb-3 position-relative">
    <label class="form-label">Тэги</label>

    <!-- Инпут поиска -->
    <input
      type="text"
      class="form-control"
      placeholder="Начните вводить тэг..."
      v-model="search"
      @focus="dropdownOpen = true"
      @keydown.enter.prevent="addTag"
      @input="filterTags"
    />

    <!-- Dropdown -->
    <div
      v-if="dropdownOpen && filteredTags.length"
      class="dropdown-menu show w-100 mt-1"
      style="max-height: 200px; overflow-y: auto"
    >
      <button
        type="button"
        class="dropdown-item"
        v-for="tag in filteredTags"
        :key="tag.id"
        @click="selectTag(tag)"
      >
        {{ tag.name }}
      </button>
    </div>

    <!-- Выбранные тэги -->
    <div class="mt-2">
      <span
        v-for="tag in selectedTags"
        :key="tag.id || tag.name"
        class="badge rounded-pill bg-secondary me-2"
      >
        {{ tag.name }}
        <button
          type="button"
          class="btn-close btn-close-white btn-sm ms-1"
          aria-label="Удалить"
          @click="removeTag(tag)"
        ></button>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  name: "TagSelect",
  props: {
    modelValue: Array, // для передачи selectedTags наружу
  },
  emits: ["update:modelValue"],
  data() {
    return {
      search: "",
      dropdownOpen: false,
      allTags: [], // загружаются с API
      filteredTags: [],
      selectedTags: [],
    };
  },
  mounted() {
    this.fetchTags();
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    async fetchTags() {
      try {
        const res = await fetch("http://localhost:8080/tags/all");
        this.allTags = await res.json();
        this.filteredTags = this.allTags;
      } catch (e) {
        console.error("Ошибка загрузки тэгов:", e);
      }
    },
    filterTags() {
      const q = this.search.toLowerCase();
      this.filteredTags = this.allTags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(q) &&
          !this.selectedTags.some((t) => t.name === tag.name)
      );
    },
    selectTag(tag) {
      this.selectedTags.push(tag);
      this.emitUpdate();
      this.resetSearch();
    },
    addTag() {
      const trimmed = this.search.trim();
      if (!trimmed) return;

      if (!this.selectedTags.some((t) => t.name === trimmed)) {
        this.selectedTags.push({ name: trimmed }); // новый тег без id
        this.emitUpdate();
      }
      this.resetSearch();
    },
    removeTag(tag) {
      this.selectedTags = this.selectedTags.filter((t) => t !== tag);
      this.emitUpdate();
    },
    emitUpdate() {
      this.$emit("update:modelValue", this.selectedTags);
    },
    resetSearch() {
      this.search = "";
      this.dropdownOpen = false;
      this.filteredTags = this.allTags;
    },
    handleClickOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.dropdownOpen = false;
      }
    },
  },
};
</script>

<style>
.dropdown-menu {
  z-index: 1000;
}
</style>
