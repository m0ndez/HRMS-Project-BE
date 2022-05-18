const jwt = require("jsonwebtoken");
const tokenData = process.env.TOKEN_SECRET;

class TokenManager {
  static getGenerateAccessToken(payload) {
    return jwt.sign({ ...payload }, tokenData, {
      expiresIn: "7d",
    });
  }

  static getSecretKey() {
    return require("crypto").randomBytes(64).toString("hex");
  }

  static checkAuthentication(request) {
    try {
      let accessToken = request.headers.token;
      let jwtResponse = jwt.verify(String(accessToken), tokenData);
      return {
        ...jwtResponse,
        token: accessToken,
      };
    } catch (err) {
      return false;
    }
  }
}

module.exports = TokenManager;
