import { api } from "@/lib/api";

const extractUser = (payload: any) => payload?.user ?? payload?.data?.user ?? payload;

const logAuthCall = (
  action: "LOGIN" | "SIGNUP" | "GET_ME" | "LOGOUT",
  payload?: Record<string, unknown>,
) => {
  console.log(`[AUTH][${action}]`, {
    baseURL: api.defaults.baseURL,
    endpoint:
      action === "LOGIN"
        ? "/auth/login"
        : action === "SIGNUP"
          ? "/auth/signup"
          : action === "GET_ME"
            ? "/auth/me"
            : "/auth/logout",
    payload,
  });
};

export const AuthService = {
  login: async (email: string, password: string) => {
    logAuthCall("LOGIN", {
      email,
      hasPassword: Boolean(password),
    });

    const res = await api.post("/auth/login", { email, password });
    return {
      ...res.data,
      user: extractUser(res.data),
    };
  },

  signup: async (data: {
    username: string;
    email?: string;
    password: string;
    role?: string;
  }) => {
    logAuthCall("SIGNUP", {
      username: data.username,
      email: data.email,
      hasPassword: Boolean(data.password),
    });

    const res = await api.post("/auth/signup", { ...data, role: data.role || "user" });
    return {
      ...res.data,
      user: extractUser(res.data),
    };
  },

  getMe: async () => {
    logAuthCall("GET_ME");
    const res = await api.get("/auth/me");
    return extractUser(res.data);
  },

  logout: async () => {
    logAuthCall("LOGOUT");
    return api.post("/auth/logout");
  },

  updateProfile: async (id: string, data: any) => {
    const res = await api.patch(`/users/${id}`, data);
    return res.data;
  },

  createChild: async (data: any) => {
    const res = await api.post("/users/children", data);
    return res.data;
  },

  getChildren: async () => {
    const res = await api.get("/users/children");
    return res.data;
  },

  removeChild: async (id: string) => {
    const res = await api.delete(`/users/children/${id}`);
    return res.data;
  },
};

export { api };
