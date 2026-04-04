import { api } from "@/lib/api";

export const AuthService = {
  login: async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  },

  signup: async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    const res = await api.post("/auth/signup", data);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },

  logout: async () => {
    return api.post("/auth/logout");
  },
};