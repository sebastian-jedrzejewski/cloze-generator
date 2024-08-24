import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { AuthContextType, AuthMutationData } from "./AuthContext.types";
import { authApi } from "../../config/api/auth/auth";
import AccessTokenService from "./AccessTokenService";
import RefreshTokenService from "./RefreshTokenService";
import { queryClient } from "../../config/api";

const initialCredentialsData = {
  error: null,
  isLoading: false,
  isSuccess: false,
};

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  login: () => {},
  loginQueryData: initialCredentialsData,
  register: () => {},
  registerQueryData: initialCredentialsData,
  logout: () => {},
  resetLoginQueryData: () => {},
  resetRegisterQueryData: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AccessTokenService.getToken() !== null,
  );
  const [loginData, setLoginData] = useState<AuthMutationData>(
    initialCredentialsData,
  );
  const [registerData, setRegisterData] = useState<AuthMutationData>(
    initialCredentialsData,
  );
  const {
    mutate: loginMutate,
    isPending: loginIsLoading,
    isSuccess: loginIsSuccess,
    error: loginError,
  } = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      AccessTokenService.storeToken(data.accessToken);
      RefreshTokenService.storeToken(data.refreshToken);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ["clozeTests"] });
    },
  });
  const {
    mutate: registerMutate,
    isPending: registerIsLoading,
    isSuccess: registerIsSuccess,
    error: registerError,
  } = useMutation({
    mutationFn: authApi.register,
  });

  useEffect(() => {
    const refresh = async () => {
      try {
        await RefreshTokenService.refreshToken();
      } catch (error) {
        logout();
      }
    };

    let refreshInterval: number;
    if (isAuthenticated) {
      refresh();

      refreshInterval = setInterval(
        () => {
          refresh();
        },
        (AccessTokenService.ACCESS_TOKEN_LIFETIME_IN_MINUTES - 1) * 60 * 1000,
      );
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [isAuthenticated]);

  useEffect(() => {
    setLoginData({
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
      error: loginError as AxiosError,
    });
  }, [loginIsLoading, loginIsSuccess, loginError]);

  useEffect(() => {
    setRegisterData({
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
      error: registerError as AxiosError,
    });
  }, [registerIsLoading, registerIsSuccess, registerError]);

  const logout = () => {
    AccessTokenService.deleteToken();
    RefreshTokenService.deleteToken();
    setIsAuthenticated(false);
    queryClient.invalidateQueries({ queryKey: ["clozeTests"] });
  };

  const resetLoginQueryData = () => {
    setLoginData(initialCredentialsData);
  };

  const resetRegisterQueryData = () => {
    setRegisterData(initialCredentialsData);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        login: loginMutate,
        register: registerMutate,
        logout,
        loginQueryData: loginData,
        registerQueryData: registerData,
        resetLoginQueryData,
        resetRegisterQueryData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
