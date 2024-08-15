import axios from "axios";
import {
  AuthApi,
  BackendLoginResponse,
  Credentials,
  MeResponse,
  RegisterResponse,
} from "./auth.types";
import { customFetch } from "../../axios";
import RefreshTokenService from "../../../store/AuthContext/RefreshTokenService";
import { parseLoginResponseForFE } from "./auth.parsers";

const loginUrl = "/auth/jwt/create/";
const registerUrl = "/auth/users/";
const refreshTokenUrl = "/auth/jwt/refresh/";
const meUrl = "/auth/users/me/";

export const authApi: AuthApi = {
  login: async (credentials: Credentials) => {
    const response = await axios.post<BackendLoginResponse>(
      loginUrl,
      credentials,
    );
    return parseLoginResponseForFE(response.data);
  },
  register: async (credentials: Credentials) => {
    const response = await axios.post<RegisterResponse>(
      registerUrl,
      credentials,
    );
    return response.data;
  },
  refreshToken: async () => {
    const response = await customFetch.post<BackendLoginResponse>(
      refreshTokenUrl,
      {
        refresh: RefreshTokenService.getToken(),
      },
    );
    return parseLoginResponseForFE(response.data);
  },
  getUserDetails: async () => {
    const response = await axios.get<MeResponse>(meUrl);
    return response.data;
  },
};
