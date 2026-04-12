import { create } from "zustand";
import { AuthService } from "../services/auth.service";

interface AuthState {
  user: any;
  token: string | null;
  isLoading: boolean;

  login: (username: string, password: string) => Promise<any>;
  signup: (data: any) => Promise<any>;
  fetchUser: () => Promise<void>;
  bootstrapSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const persistAuth = (user: any) => {
  if (typeof window === "undefined") return;

  if (user) {
    sessionStorage.setItem("user", JSON.stringify(user));
  } else {
    sessionStorage.removeItem("user");
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,

  login: async (username, password) => {
    set({ isLoading: true });

    try {
      const data = await AuthService.login(username, password);
      const user = data.user ?? (await AuthService.getMe());

      persistAuth(user);

      set({
        user,
        token: null,
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
      const user = data.user ?? (await AuthService.getMe());

      persistAuth(user);

      set({
        user,
        token: null,
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
      persistAuth(user);
      set({ user });
    } catch {
      persistAuth(null);
      set({ user: null });
    }
  },

  bootstrapSession: async () => {
    if (typeof window !== "undefined") {
      const cachedUser = sessionStorage.getItem("user");

      if (cachedUser) {
        try {
          set({ user: JSON.parse(cachedUser) });
        } catch {
          sessionStorage.removeItem("user");
        }
      }
    }

    await get().fetchUser();
  },

  logout: async () => {
    try {
      await AuthService.logout();
    } catch {}

    persistAuth(null);

    set({
      user: null,
      token: null,
    });
  },
}));
