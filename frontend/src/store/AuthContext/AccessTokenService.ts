class AccessTokenService {
  static ACCESS_TOKEN_ITEM_NAME = "access_token";
  static ACCESS_TOKEN_LIFETIME_IN_MINUTES = 5;

  static storeToken(token: string) {
    localStorage.setItem(this.ACCESS_TOKEN_ITEM_NAME, token);
  }

  static getToken() {
    return localStorage.getItem(this.ACCESS_TOKEN_ITEM_NAME);
  }

  static deleteToken() {
    localStorage.removeItem(this.ACCESS_TOKEN_ITEM_NAME);
  }

  static bearerHeader() {
    return `Bearer ${this.getToken()}`;
  }
}

export default AccessTokenService;
