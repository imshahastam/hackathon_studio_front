import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import HackathonList from "../views/HackathonList.vue";
import HackathonDetail from "../views/HackathonDetail.vue";
import TeamDetails from "@/views/TeamDetails.vue";
import Leaderboard from "../views/Leaderboard.vue";
import LoginPage from "../views/LoginPage.vue";
import RegistrationForm from "@/views/RegistrationForm.vue";
import DashboardPage from "@/views/DashboardPage.vue";
import OrganizerDashboard from "@/views/dashboards/OrganizerDashboard.vue";
import ParticipantDashboard from "@/views/dashboards/ParticipantDashboard.vue";
import JudgeDashboard from "@/views/dashboards/JudgeDashboard.vue";
import HackathonTeams from "@/views/HackathonTeams.vue";
import HackathonJudges from "@/views/HackathonJudges.vue";
import ParticipantTeams from "@/views/ParticipantTeams.vue";
import CreateHackathonForm from "@/views/CreateHackathonForm.vue";
import TestComponent from "@/components/TestComponent.vue";
import { useAuthStore } from "../store/auth.js";
import OrganizerHackathons from "@/views/OrganizerHackathons.vue";
import JudgeInvitations from "@/views/JudgeInvitations.vue";
import JudgeProfile from "@/views/JudgeProfile.vue";

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
    path: "/teams/:id",
    name: "TeamDetails",
    component: TeamDetails,
    props: true,
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
    path: "/participant",
    name: "ParticipantDashboard",
    component: ParticipantDashboard,
    redirect: "/participant/teams",
    children: [
      {
        path: "my-hackathons-part",
        name: "MyHackathonsParticipant",
        component: OrganizerHackathons,
        props: { isParticipantView: true },
      },
      {
        path: "teams",
        name: "ParticipantTeams",
        component: ParticipantTeams,
      },
    ],
  },
  {
    path: "/judge",
    name: "JudgeDashboard",
    component: JudgeDashboard,
    redirect: "invitations",
    children: [
      {
        path: "invitations",
        name: "JudgeInvitations",
        component: JudgeInvitations,
      },
    ],
  },
  {
    path: "/organizer",
    name: "OrganizerDashboard",
    component: OrganizerDashboard,
    redirect: "/my-hackathons",
    children: [
      {
        path: "/my-hackathons",
        name: "MyHackathonsOrganizer",
        component: OrganizerHackathons,
        props: { isParticipantView: false },
      },
      {
        path: "/my-hackathons-teams",
        name: "HackathonTeams",
        component: HackathonTeams,
      },
      {
        path: "/my-hackathons-judges",
        name: "HackathonJudges",
        component: HackathonJudges,
      },
    ],
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
  {
    path: "/my-hackathons-judges/:id",
    name: "JudgeProfile",
    component: JudgeProfile,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
