var config = require("../dbconfig");
const sql = require("mssql");

async function getEmployeeReport() {
  try {
    let pool = await sql.connect(config);
    let response = await pool.request().execute("GetEmployeeReport");

    if (response.recordsets.length > 0) {
      return response.recordset;
    } else {
      return undefined;
    }
  } catch (error) {
    return { ...error };
  }
}

module.exports = {
    getEmployeeReport
}
