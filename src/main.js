import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./store";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill-emoji/dist/quill-emoji.css";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";

const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount("#app");
