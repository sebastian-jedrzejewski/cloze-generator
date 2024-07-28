import { Dispatch, SetStateAction } from "react";
import { AxiosError } from "axios";

import { Credentials } from "../../config/api/auth/auth.types";

export type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  login: (credentials: Credentials) => void;
  logout: () => void;
  register: (credentials: Credentials) => void;
  loginQueryData: AuthMutationData;
  registerQueryData: AuthMutationData;
  resetLoginQueryData: () => void;
  resetRegisterQueryData: () => void;
};

export type AuthMutationData = {
  isLoading: boolean;
  isSuccess: boolean;
  error: AxiosError | null;
};
