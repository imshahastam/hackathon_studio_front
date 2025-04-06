import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import HackathonList from "../views/HackathonList.vue";
import HackathonDetail from "../views/HackathonDetail.vue";
import Leaderboard from "../views/Leaderboard.vue";
import LoginPage from "../views/LoginPage.vue";
import Dashboard from "../views/Dashboard.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/hackathons",
    name: "Hackathons",
    component: HackathonList,
  },
  {
    path: "/hackathons/:id",
    name: "HackathonDetail",
    component: HackathonDetail,
    props: true, // передаем параметр в компонент
  },
  {
    path: "/leaderboard",
    name: "Leaderboard",
    component: Leaderboard,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
