import axios from "axios";

const defaultApiBaseUrl = import.meta.env.DEV
  ? "/api"
  : "https://nextalk-backend-xax9.onrender.com/api";
const configuredApiBaseUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");
const apiBaseUrl =
  import.meta.env.PROD &&
  (!configuredApiBaseUrl || configuredApiBaseUrl === "/api")
    ? defaultApiBaseUrl
    : configuredApiBaseUrl || defaultApiBaseUrl;
const normalizedApiBaseUrl =
  apiBaseUrl === "/api" || apiBaseUrl.endsWith("/api")
    ? apiBaseUrl
    : `${apiBaseUrl}/api`;

const api = axios.create({
  baseURL: normalizedApiBaseUrl,
  withCredentials: true,
});

export default api;
