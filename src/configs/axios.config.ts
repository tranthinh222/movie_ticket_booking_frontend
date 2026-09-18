import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  timeout: 15000,
});

const handleRefreshToken = async (): Promise<string | null> => {
  try {
    const res = await instance.get("/api/v1/auth/refresh");
    if (res && (res as any).data?.accessToken) {
      return (res as any).data.accessToken;
    }
    return null;
  } catch (error) {
    return null;
  }
};

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    const pathname = new URL(config.url || "", config.baseURL || window.location.origin).pathname;
    const isPublicFilmRequest =
      config.method?.toLowerCase() === "get" &&
      /^\/api\/v1\/(?:films|news|discounts)(?:\/|$)/.test(pathname);
    const isPublicAssistantRequest = config.method?.toLowerCase() === "post" &&
      /^\/api\/v1\/assistant\/(?:chat|recommendations|seat-recommendations)$/.test(pathname);
    const isRefreshRequest = pathname === "/api/v1/auth/refresh";
    const isAuthEntryRequest = /^\/api\/v1\/auth\/(?:login|register)$/.test(pathname);
    if (token && !isPublicFilmRequest && !isPublicAssistantRequest && !isRefreshRequest && !isAuthEntryRequest) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    return response.data || response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !/\/api\/v1\/auth\/(?:refresh|login|register)(?:[?#]|$)/.test(originalRequest.url)
    ) {
      originalRequest._retry = true;
      const access_token = await handleRefreshToken();
      if (access_token) {
        localStorage.setItem("access_token", access_token);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
        return instance(originalRequest);
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default instance;
