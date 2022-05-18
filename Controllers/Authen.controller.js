var config = require("../dbconfig");
const sql = require("mssql");
const TokenManager = require("../Services/tokenManager");

async function getLogin(data) {
  try {
    let pool = await sql.connect(config);
    let response = await pool
      .request()
      .input("username", sql.NVarChar(200), data.username)
      .input("password", sql.NVarChar(200), data.password)
      .input("permission", sql.NVarChar(200), data.permission)
      .execute("Authentication");
      
    if (response.recordsets.length > 0) {
      const convertRecordObj = {};
      Object.keys(response.recordset[0]).forEach((keyItem) => {
        const splitKey = keyItem.split("_")[1];
        if (splitKey && !["username", "password"].includes(splitKey))
          convertRecordObj[splitKey] = response.recordset[0][keyItem];
      });
      let token = TokenManager.getGenerateAccessToken({
        id: convertRecordObj.id,
        permission: data.permission,
        username: data.username,
        password: data.password,
      });
      

      return { ...convertRecordObj, token: token };
    } else {
      return undefined;
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getLogin,
};
