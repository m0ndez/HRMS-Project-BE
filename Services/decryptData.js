const CryptoJs = require("crypto-js");
const dotEnv = require("dotenv");

dotEnv.config();

const passwordDecrypt = (password) => {
  return CryptoJs.AES.decrypt(password, process.env.KEY_SECRET).toString(
    CryptoJs.enc.Utf8
  );
};

module.exports = {
  passwordDecrypt,
};
