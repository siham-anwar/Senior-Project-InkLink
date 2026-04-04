import { create } from "zustand";
import { AuthService } from "../services/auth.service";

interface AuthState {
  user: any;
  token: string | null;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<any>;
  signup: (data: any) => Promise<any>;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const persistAuth = (user: any, token: string | null) => {
  if (typeof window === "undefined") return;

  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }

  if (user) {
    sessionStorage.setItem("user", JSON.stringify(user));
  } else {
    sessionStorage.removeItem("user");
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const data = await AuthService.login(email, password);
      const token = data.accessToken ?? data.token ?? null;
      const user = data.user ?? (token ? await AuthService.getMe() : { email });

      persistAuth(user, token);

      set({
        user,
        token,
      });

      return data;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (formData) => {
    set({ isLoading: true });

    try {
      const data = await AuthService.signup(formData);
      const token = data.accessToken ?? data.token ?? null;
      const user = data.user ?? (token ? await AuthService.getMe() : formData);

      persistAuth(user, token);

      set({
        user,
        token,
      });

      return data;
    } catch (err) {
      console.error("Signup failed:", err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUser: async () => {
    try {
      const user = await AuthService.getMe();
      set({ user });
    } catch {
      set({ user: null });
    }
  },

  logout: async () => {
    try {
      await AuthService.logout();
    } catch {}

    persistAuth(null, null);

    set({
      user: null,
      token: null,
    });
  },
}));