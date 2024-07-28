import { authApi } from "../../config/api/auth/auth";
import AccessTokenService from "./AccessTokenService";

class RefreshTokenService {
  static REFRESH_TOKEN_ITEM_NAME = "refresh_token";

  static storeToken(token: string) {
    document.cookie = `${this.REFRESH_TOKEN_ITEM_NAME}=${token}; path=/; secure;`;
  }

  static getToken() {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === this.REFRESH_TOKEN_ITEM_NAME) {
        return value;
      }
    }
    return null;
  }

  static deleteToken() {
    document.cookie = `${this.REFRESH_TOKEN_ITEM_NAME}=; secure;`;
  }

  static async refreshToken() {
    const response = await authApi.refreshToken();
    AccessTokenService.storeToken(response.accessToken);
  }
}

export default RefreshTokenService;
