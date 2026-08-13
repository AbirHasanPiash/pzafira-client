import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://pzafira-cloth-store.vercel.app";

const api = axios.create({ baseURL: BASE_URL });

/**
 * Attach the current access token at request time.
 *
 * Reading from localStorage per request (rather than once at module load) keeps
 * every tab and every provider in sync after a login, logout or token refresh.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `JWT ${token}`;
  }
  return config;
});

/**
 * Single-flight refresh: if several requests fail with 401 at the same time,
 * they all await one refresh call instead of firing one each.
 */
let refreshPromise = null;

const requestNewAccessToken = async () => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return null;

  // A bare client, so a failing refresh cannot re-enter this interceptor.
  const { data } = await axios.post(`${BASE_URL}/auth/jwt/refresh/`, { refresh });
  localStorage.setItem("access", data.access);
  return data.access;
};

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = requestNewAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

const endSession = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  window.dispatchEvent(new Event("session-expired"));
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    // Network failures, non-401s and already-retried requests pass straight through.
    if (!response || response.status !== 401 || !config || config._retry) {
      return Promise.reject(error);
    }

    // A 401 from the token endpoints means bad credentials, not an expired token.
    if (config.url?.includes("/auth/jwt/")) {
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      const token = await refreshAccessToken();
      if (!token) {
        endSession();
        return Promise.reject(error);
      }
      config.headers.Authorization = `JWT ${token}`;
      return api(config);
    } catch {
      endSession();
      return Promise.reject(error);
    }
  }
);

export default api;
