import axios from "axios";
import { cacheTokenKey } from "@/constants";

const baseURL = process.env.API_BASE_URL,
  isServer = typeof window === "undefined";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    if (isServer) {
      const { cookies } = await import("next/headers"),
        token = cookies().get(cacheTokenKey)?.value;

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } else {
      const token = document.cookie.replace(
        new RegExp(`(?:(?:^|.*;\\s*)${cacheTokenKey}\\s*=\\s*([^;]*).*$)|^.*$`),
        "$1",
      );

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  async (response) => {
    if (response.status !== 200) {
      // todo: add 401
      throw response;
    }
    return response.data;
  },
  (error) => Promise.reject(error),
);

export default api;
