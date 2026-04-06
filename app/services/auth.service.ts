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
  login: async (username: string, password: string) => {
    logAuthCall("LOGIN", {
      username,
      hasPassword: Boolean(password),
    });

    const res = await api.post("/auth/login", { username, password });
    return {
      ...res.data,
      user: extractUser(res.data),
    };
  },

  signup: async (data: {
    username: string;
    email?: string;
    password: string;
  }) => {
    logAuthCall("SIGNUP", {
      username: data.username,
      email: data.email,
      hasPassword: Boolean(data.password),
    });

    const res = await api.post("/auth/signup", { ...data, role: "user" });
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
};
