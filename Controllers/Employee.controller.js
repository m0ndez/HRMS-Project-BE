var config = require("../dbconfig");
const sql = require("mssql");

async function createEmployee(data) {
  try {
    let pool = await sql.connect(config);
    let response = await pool
      .request()
      .input("fname", sql.NVarChar(200), data.fname)
      .input("lname", sql.NVarChar(200), data.lname)
      .input("address", sql.NVarChar(200), data.address)
      .input("tel", sql.NVarChar(20), data.tel)
      .input("username", sql.NVarChar(200), data.username)
      .input("password", sql.NVarChar(200), data.password)
      .input("position", sql.NVarChar(200), data.position)
      .input("sex", sql.Int, data.sex)
      .execute("CreateEmployee");

    if (response.recordsets.length > 0) {
      return { ...response.recordset[0] };
    } else {
      return undefined;
    }
  } catch (error) {
    return { ...error };
  }
}

async function getAllEmployee() {
  try {
    let pool = await sql.connect(config);
    const response = await pool.request().execute("GetAllEmployee");
    return response.recordset;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createEmployee,
  getAllEmployee,
};
