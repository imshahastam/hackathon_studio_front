import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null, // Загружаем токен из localStorage, если он есть
    username: localStorage.getItem("username") || null,
  }),
  actions: {
    setToken(token, username) {
      this.token = token;
      this.username = username; // Сохраняем пользователя в state
      localStorage.setItem("token", token);
      localStorage.setItem("username", username); // Сохраняем в localStorage
      console.log("Token set:", this.token); // Проверяем, что токен сохранен
      console.log("Username set:", this.username);
    },
    clearToken() {
      this.token = null;
      this.username = null;
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      console.log("Token cleared:", this.token); // Проверяем, что токен очищен
      console.log("Username cleared:", this.username); // Проверяем, что имя очищено
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token, // Проверяем, есть ли токен
  },
});
