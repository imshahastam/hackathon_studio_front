import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./store";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount("#app");
