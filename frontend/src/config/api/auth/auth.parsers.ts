import { BackendLoginResponse, LoginResponse } from "./auth.types";

export const parseLoginResponseForFE = (
  data: BackendLoginResponse,
): LoginResponse => {
  return {
    accessToken: data.access,
    refreshToken: data.refresh,
  };
};
