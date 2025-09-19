import Axios from "axios";
import { getFromStore } from "../utils/appHelpers";

// 🔑 Use environment-based token key (must match what you set during login)
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;

// 🔗 Base Axios instance
export const axiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// --- Request Interceptor ---
// Attaches Authorization header automatically if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getFromStore(TOKEN_KEY, "local");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn(`[Axios] No token found under key: ${TOKEN_KEY}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor (optional: handles expired tokens globally) ---
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("[Axios] Unauthorized: Invalid or expired token");
      // 🔄 You can trigger logout or refresh logic here
    }
    return Promise.reject(error);
  }
);

// --- Cache Helpers ---
export const XCache = (url: string, xcache: string) => {
  const urlObj = new URL(url, import.meta.env.VITE_BASE_URL);

  if (urlObj.searchParams.has("xc")) {
    urlObj.searchParams.set("xc", xcache);
  } else {
    urlObj.searchParams.append("xc", xcache);
  }

  return urlObj.toString();
};

export const cacheFirst = (url: string) => XCache(url, "cf");
export const networkFirst = (url: string) => XCache(url, "nf");
export const staleWhileRevalidate = (url: string) => XCache(url, "swr");
export const cacheOnly = (url: string) => XCache(url, "co");
export const networkOnly = (url: string) => XCache(url, "no");

// --- Fetcher Utility (useful with SWR/React Query) ---
export const fetcher = async (url: string) => {
  const response = await axiosInstance.get(url);
  return response?.data ?? null;
};
