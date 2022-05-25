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

    if (response.recordsets.length > 0) {
      return response.recordset;
    } else {
      return undefined;
    }
  } catch (error) {
    return { ...error };
  }
}

async function changeEmployeeState(data) {
  try {
    let pool = await sql.connect(config);
    const response = await pool
      .request()
      .input("id", sql.NVarChar(20), data.id)
      .input("state", sql.Bit(), data.state)
      .execute("ChangeEmployeeState");
    if (response.rowsAffected[0] !== 0) {
      return response.rowsAffected;
    } else {
      return undefined;
    }
  } catch (error) {
    return { ...error };
  }
}

async function deleteEmployee(id) {
  try {
    let pool = await sql.connect(config);
    const response = await pool.query(`
    DELETE 
    FROM tb_employee
    WHERE emp_id = '${id}'
	  `);
    if (response.rowsAffected[0] !== 0) {
      return response.rowsAffected;
    } else {
      return undefined;
    }
  } catch (error) {
    return { ...error };
  }
}

async function getDetailEmployee(id) {
  try {
    let pool = await sql.connect(config);
    const response = await pool.query(`
    SELECT 
    emp_id as id,
    emp_fname as fname,
    emp_lname as lname,
    emp_address as address,
    emp_tel as tel,
    emp_sex as sex,
    emp_position as position,
    emp_username as username,
    emp_password as password,
    emp_state as state
    FROM tb_employee
    WHERE emp_id = '${id}'
    `);
    console.log(response);
    if (response.recordsets.length > 0) {
      return response.recordset[0];
    } else {
      return undefined;
    }
  } catch (error) {
    return { ...error };
  }
}
async function updateEmployee(data) {
  try {
    let pool = await sql.connect(config);
    const response = await pool
      .request()
      .input("id", sql.VarChar(16), data.id)
      .input("fname", sql.NVarChar(200), data.fname)
      .input("lname", sql.NVarChar(200), data.lname)
      .input("address", sql.NVarChar(200), data.address)
      .input("tel", sql.NVarChar(20), data.tel)
      .input("username", sql.NVarChar(200), data.username)
      .input("password", sql.NVarChar(200), data.password)
      .input("position", sql.NVarChar(200), data.position)
      .input("sex", sql.Int, data.sex)
      .input("state", sql.Bit, data.state)
      .execute("UpdateEmployee");
    if (response.rowsAffected[0] !== 0) {
      return response.rowsAffected;
    } else {
      return undefined;
    }
  } catch (error) {
    return { ...error };
  }
}

module.exports = {
  createEmployee,
  getAllEmployee,
  changeEmployeeState,
  deleteEmployee,
  getDetailEmployee,
  updateEmployee,
};
