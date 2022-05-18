var config = require("../dbconfig");
const sql = require("mssql");

async function editUser(data) {
  try {
    let pool = await sql.connect(config);
    let response = await pool
      .request()
      .input("id", sql.NVarChar(20), data.id)
      .input("permission", sql.NVarChar(200), data.permission)
      .input("fname", sql.NVarChar(200), data.fname)
      .input("lname", sql.NVarChar(200), data.lname)
      .input("address", sql.NVarChar(200), data.address)
      .input("tel", sql.NVarChar(20), data.tel)
      .input("position", sql.NVarChar(200), data.position)
      .input("sex", sql.Int, data.sex)
      .execute("EditUser");

    if (response.recordsets.length > 0) {
      const convertRecordObj = {};
      Object.keys(response.recordset[0]).forEach((keyItem) => {
        const splitKey = keyItem.split("_")[1];
        if (splitKey && !["username", "password"].includes(splitKey))
          convertRecordObj[splitKey] = response.recordset[0][keyItem];
      });

      return { ...convertRecordObj };
    } else {
      return undefined;
    }
  } catch (error) {
    console.log(error);
  }
}

async function userMe(jwt) {
  try {
    let pool = await sql.connect(config);
    let response = await pool.query(
      `SELECT * FROM ${
        ["admin"].includes(jwt.permission) ? `tb_admin` : `tb_employee`
      } WHERE ${
        ["admin"].includes(jwt.permission) ? `admin_id` : `emp_id`
      } = '${jwt.id}'`
    );

    if (response.recordsets.length > 0) {
      const convertRecordObj = {};
      Object.keys(response.recordset[0]).forEach((keyItem) => {
        const splitKey = keyItem.split("_")[1];
        if (splitKey && !["username", "password"].includes(splitKey))
          convertRecordObj[splitKey] = response.recordset[0][keyItem];
      });
      // console.log("res", convertRecordObj);

      return { ...convertRecordObj };
    } else {
      return undefined;
    }
  } catch (error) {
    console.log(error);
  }
}

async function changeUserPassword(data) {
  try {
    let pool = await sql.connect(config);
    let response = await pool
      .request()
      .input("id", sql.NVarChar(20), data.id)
      .input("permission", sql.NVarChar(200), data.permission)
      .input("new_password", sql.NVarChar(200), data.new_password)
      .execute("ChangePassword");
    if (response.recordsets.length > 0) {
      const convertRecordObj = {};
      Object.keys(response.recordset[0]).forEach((keyItem) => {
        const splitKey = keyItem.split("_")[1];
        if (splitKey && !["username", "password"].includes(splitKey))
          convertRecordObj[splitKey] = response.recordset[0][keyItem];
      });

      return { ...convertRecordObj };
    } else {
      return undefined;
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  editUser,
  userMe,
  changeUserPassword,
};
