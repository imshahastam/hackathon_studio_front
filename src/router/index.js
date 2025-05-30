import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import HackathonList from "../views/HackathonList.vue";
import HackathonDetail from "../views/HackathonDetail.vue";
import Leaderboard from "../views/Leaderboard.vue";
import LoginPage from "../views/LoginPage.vue";
import RegistrationForm from "@/views/RegistrationForm.vue";
import DashboardPage from "../views/Dashboard.vue";
import CreateHackathonForm from "@/views/CreateHackathonForm.vue";
import TestComponent from "@/components/TestComponent.vue";
import { useAuthStore } from "../store/auth.js";
import OrganizerHackathons from "@/views/OrganizerHackathons.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/test",
    name: "TestComponent",
    component: TestComponent,
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
  { path: "/register", name: "Register", component: RegistrationForm },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      if (authStore.isAuthenticated) {
        next("/dashboard"); // Если пользователь авторизован, перенаправляем на дашборд
      } else {
        next(); // Если не авторизован, оставляем на странице входа
      }
    },
  },
  {
    path: "/dashboard",
    name: "DashboardPage",
    component: () => DashboardPage,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        next("/login"); // Если нет токена, перенаправляем на страницу входа
      } else {
        next(); // Если токен есть, продолжаем переход
      }
    },
  },
  {
    path: "/my-hackathons",
    name: "OrganizerHackathons",
    component: OrganizerHackathons,
  },
  {
    path: "/hackathons/create",
    name: "CreateHackathonForm",
    component: CreateHackathonForm,
  },
  {
    path: "/hackathons/:id/edit",
    name: "EditHackathon",
    component: CreateHackathonForm,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
