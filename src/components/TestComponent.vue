<template>
  <div>
    <quillEditor v-model="desc" :modules="modules" />
    <p>Current desc: {{ desc }}</p>
  </div>
</template>

<script>
import { quillEditor } from "vue3-quill";
import Quill from "quill";
import "quill-emoji";
Quill.register("modules/emoji", require("quill-emoji").default);

export default {
  components: { quillEditor },
  data() {
    return {
      desc: "",
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
};
</script>
