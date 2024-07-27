import axios from "axios";

import AccessTokenService from "../store/AuthContext/AccessTokenService";
import { BACKEND_BASE_URL } from "../constants/api";

axios.defaults.baseURL = BACKEND_BASE_URL;

axios.interceptors.request.use(
  (config) => {
    const token = AccessTokenService.getToken();
    if (token) {
      config.headers.Authorization = AccessTokenService.bearerHeader();
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 400) {
      error.message = error.response.data;
    }
    throw error;
  },
);

export const customFetch = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: { "Content-Type": "application/json" },
});
