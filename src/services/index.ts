import Axios from "axios";
import { getFromStore } from "../utils/appHelpers";

export const axiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // headers: {
  // "Content-Type": "application/json",
  // 'X-Correlation-ID': uid(),
  // },
});

// --- Request Interceptor to add Authorization and X-School-ID headers ---
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve token and school ID dynamically
    const token = getFromStore("token");
    console.log(token);
 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const XCache = (url: string, xcache: string) => {
  const urlObj = new URL(url, import.meta.env.VITE_BASE_URL);
  if (urlObj.searchParams.get("xc")) {
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

export const fetcher = async (url: string) =>
  axiosInstance.get(url).then((res) => res?.data?.data?.school);
