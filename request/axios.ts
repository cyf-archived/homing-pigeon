import axios from "axios";
import { v4 as uuidV4 } from "uuid";
import { isPlainObject, isEmpty } from "lodash";
import { fallbackLng } from "@/i18n/settings";
import { cacheTokenKey, cacheLngKey } from "@/constants";
import { encryptSensitiveInfo, sign } from "@/utils";

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
    config.params = config.params || {};
    config.params["timestamp"] = Date.now();
    config.params["nonce"] = uuidV4();

    if (config.method?.toUpperCase() === "GET") {
      config.params = {
        ...config.params,
        ...encryptSensitiveInfo(config.url || "", config.params),
      };
    }

    const data = config.data;
    if (
      config.method?.toUpperCase() === "POST" &&
      isPlainObject(data) &&
      !isEmpty(data)
    ) {
      config.data = {
        ...config.data,
        ...encryptSensitiveInfo(config.url || "", config.data),
      };
    }

    config.headers = config.headers || {};
    config.headers["x-sign"] = sign(config.params);
    config.headers["x-channel"] = "WEB";

    if (isServer) {
      const { cookies } = await import("next/headers"),
        token = cookies().get(cacheTokenKey)?.value;

      config.headers["x-locale"] =
        cookies().get(cacheLngKey)?.value || fallbackLng;
      if (token) {
        config.headers["x-token"] = `Bearer ${token}`;
      }
    } else {
      const token = document.cookie.replace(
        new RegExp(`(?:(?:^|.*;\\s*)${cacheTokenKey}\\s*=\\s*([^;]*).*$)|^.*$`),
        "$1",
      );
      const locale = document.cookie.replace(
        new RegExp(`(?:(?:^|.*;\\s*)${cacheLngKey}\\s*=\\s*([^;]*).*$)|^.*$`),
        "$1",
      );

      config.headers["x-locale"] = locale || fallbackLng;
      if (token) {
        config.headers["x-token"] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  async (response) => {
    if (![200, 201].includes(response.status)) {
      // todo: add 401
      throw response;
    }
    return response.data;
  },
  (error) => Promise.reject(error),
);

export default api;
