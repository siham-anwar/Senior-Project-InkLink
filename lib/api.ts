import axios, { AxiosError, AxiosRequestConfig } from "axios";

const PROD_API_URL = "https://inklink-backend-y0p5.onrender.com";

const isLocalUrl = (value?: string) =>
  typeof value === "string" && /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?/i.test(value);

const resolveDefaultApiUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  const isLocalHost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  const LOCAL_BACKEND = "http://localhost:4000";

  if (envUrl) {
    // If the env URL is the production one but we are on localhost, 
    // and the user explicitly asked for local fallback, we can prioritize local.
    // However, usually we should respect the env variable.
    // Let's make it so if it's production URL but we are on localhost, we allow it, 
    // but the fallback logic should be robust.
    if (isLocalUrl(envUrl)) {
      return isLocalHost ? envUrl : PROD_API_URL;
    }

    // If we are on localhost and the API is pointing to production, 
    // but the user is experiencing issues, they might want to toggle it.
    // For now, let's keep the envUrl if provided, but if not provided, use localhost.
    return envUrl;
  }

  if (isLocalHost) {
    return LOCAL_BACKEND;
  }

  return PROD_API_URL;
};

const resolveUrl = (config?: AxiosRequestConfig) => {
  const requestUrl = config?.url ?? "";
  const baseURL = config?.baseURL ?? "";

  if (!requestUrl) return baseURL;
  if (/^https?:\/\//i.test(requestUrl)) return requestUrl;
  if (!baseURL) return requestUrl;

  return `${baseURL.replace(/\/$/, "")}/${requestUrl.replace(/^\//, "")}`;
};

const safeSerialize = (value: unknown) => {
  try {
    return JSON.parse(
      JSON.stringify(value, (_key, nestedValue) => {
        if (nestedValue === undefined) {
          return null;
        }

        if (nestedValue instanceof Error) {
          return {
            name: nestedValue.name,
            message: nestedValue.message,
            stack: nestedValue.stack,
          };
        }

        return nestedValue;
      }),
    );
  } catch {
    return String(value);
  }
};

const getAxiosErrorDetails = (error: AxiosError) => {
  const responseData = error.response?.data as
    | { message?: string | string[]; error?: string }
    | undefined;

  const message =
    Array.isArray(responseData?.message)
      ? responseData?.message.join(", ")
      : responseData?.message || responseData?.error || error.message;

  return {
    name: error.name ?? "AxiosError",
    isAxiosError: true,
    message: message ?? "Unknown Axios error",
    code: error.code ?? null,
    status: error.response?.status ?? null,
    method: error.config?.method?.toUpperCase() ?? null,
    url: resolveUrl(error.config) || null,
    baseURL: error.config?.baseURL ?? null,
    requestHeaders: error.config?.headers,
    responseHeaders: error.response?.headers,
    responseData: error.response?.data,
    hasRequestObject: Boolean(error.request),
    hasResponseObject: Boolean(error.response),
  };
};

export const extractApiErrorMessage = (
  error: unknown,
  fallbackMessage: string,
) => {
  if (axios.isAxiosError(error)) {
    const details = getAxiosErrorDetails(error);

    if (!details.status && details.hasRequestObject) {
      return `Network error: could not reach ${details.url || api.defaults.baseURL}. Check backend status, NEXT_PUBLIC_API_URL, and CORS.`;
    }

    return details.message || fallbackMessage;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

export const api = axios.create({
  baseURL: resolveDefaultApiUrl(),
  withCredentials: true, // needed if backend uses cookies
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    console.log("[API][REQUEST]", {
      method: config.method?.toUpperCase(),
      url: resolveUrl(config),
      baseURL: config.baseURL,
      withCredentials: config.withCredentials,
      authMode: "cookie",
    });
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const details = getAxiosErrorDetails(error);
      const serializedDetails = safeSerialize(details);
      const summary = `[API][ERROR][SUMMARY] ${details.method ?? "UNKNOWN"} ${details.url ?? "unknown-url"} -> ${details.status ?? "NO_STATUS"} (${details.message})`;
      const log = details.status ? console.warn : console.error;

      log(summary);
      log("[API][ERROR]", details);
      log("[API][ERROR:SERIALIZED]", serializedDetails);
      log("[API][ERROR:JSON]", JSON.stringify(serializedDetails, null, 2));

      if (!details.status && details.hasRequestObject) {
        console.warn(
          "[API][HINT] This usually means CORS/preflight failure, wrong API URL, backend down, or mixed-content (https frontend -> http backend).",
        );
      }

      return Promise.reject(error);
    }

    console.error("[API][ERROR][NON_AXIOS]", safeSerialize(error));
    return Promise.reject(error);
  },
);
