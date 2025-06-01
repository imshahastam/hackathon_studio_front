import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";

export function useLogout() {
  const authStore = useAuthStore();
  const router = useRouter();

  return function logout() {
    authStore.clearToken();
    router.push("/"); // на главную, можно изменить
  };
}
