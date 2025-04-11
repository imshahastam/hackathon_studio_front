<template>
  <div class="container mt-5" style="max-width: 400px">
    <h2 class="mb-4">Вход</h2>

    <form @submit.prevent="login">
      <div class="mb-3">
        <label for="username" class="form-label">Логин</label>
        <input
          v-model="username"
          type="text"
          class="form-control"
          id="username"
          required
        />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Пароль</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          id="password"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary w-100">Войти</button>
    </form>

    <p class="mt-3 text-center text-muted" style="cursor: pointer">
      Регистрация
    </p>
  </div>
</template>

<script>
import { useAuthStore } from "../store/auth.js";

export default {
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch("http://localhost:8080/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        if (!response.ok) {
          throw new Error("Неверные данные");
        }

        const data = await response.json(); // Получаем токен из ответа
        const token = data.token;
        const currUsername = data.username;

        console.log("Received token:", token); // Проверяем токен
        console.log("Received username:", currUsername); // Проверяем имя пользователя

        // Сохраняем токен в Pinia store и localStorage
        const authStore = useAuthStore();
        authStore.setToken(token, currUsername);

        // Перенаправляем пользователя на страницу с личным кабинетом
        this.$router.push("/dashboard");
      } catch (error) {
        console.error("Ошибка входа:", error);
        alert("Ошибка входа. Проверьте логин и пароль.");
      }
    },
  },
};
</script>

<style scoped>
.container {
  background: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
