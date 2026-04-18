import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import store from "@/store/store";
import { clearAuth, setAuth } from "@/store/slices/AuthSlice";

interface RetryRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
api.interceptors.request.use((config) => {
  const token = store.getState().auth.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ---------------- RESPONSE INTERCEPTOR ---------------- */
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequest;

    // 🔴 If no response, network error
    if (!error.response) {
      return Promise.reject(error);
    }

    const { status } = error.response;

    // 🚫 Do NOT refresh token for auth routes
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    // 🔁 Handle 401 (access token expired)
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/auth/refresh-token");

        store.dispatch(
          setAuth({
            access_token: res.data.accessToken,
            user: store.getState().auth.user,
          }),
        );

        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(clearAuth());
        return Promise.reject(refreshError);
      }
    }

    // ✅ IMPORTANT: propagate all other errors
    return Promise.reject(error);
  },
);

export default api;
