import axios from "axios";
import sortKeysRecursive from "sort-keys-recursive";
import queryString from "query-string";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import { fallbackLng } from "@/i18n/settings";
import { cacheTokenKey, cacheLngKey } from "@/constants";

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
    config.params["nonce"] = uuidv4();
    const queryStr = queryString.stringify(sortKeysRecursive(config.params));
    const utf8Str = CryptoJS.enc.Utf8.parse(
      queryStr + process.env.REQUEST_SIGN_KEY,
    );
    config.headers["x-sign"] = CryptoJS.enc.Hex.stringify(
      CryptoJS.MD5(utf8Str),
    );
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
