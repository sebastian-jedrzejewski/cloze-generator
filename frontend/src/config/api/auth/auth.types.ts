export type Credentials = {
  email: string;
  password: string;
};

export type BackendLoginResponse = {
  access: string;
  refresh: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type RegisterResponse = {
  id: string;
  email: string;
};

export type MeResponse = {
  id: number;
  email: string;
};

export type AuthApi = {
  login: (credentials: Credentials) => Promise<LoginResponse>;
  register: (credentials: Credentials) => Promise<RegisterResponse>;
  refreshToken: () => Promise<LoginResponse>;
  getUserDetails: () => Promise<MeResponse>;
};
