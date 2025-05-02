import { defineStore } from "pinia";

import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    username: localStorage.getItem("username") || null,
    roles: [],
  }),
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      this.username = decoded.sub;
      this.roles = decoded.roles || [];

      localStorage.setItem("username", this.username);
      localStorage.setItem("roles", JSON.stringify(this.roles));
    },
    clearToken() {
      this.token = null;
      this.username = null;
      this.roles = [];
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("roles");
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    hasRole: (state) => (role) => state.roles.includes(role),
  },
});
