import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./store";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill-emoji/dist/quill-emoji.css";
import axios from "axios";
import "./assets/tailwind.css";

axios.defaults.baseURL = "http://localhost:8080";

const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(Vue3Toastify, {
  autoClose: 3000,
});

app.mount("#app");
