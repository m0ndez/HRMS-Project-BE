var config = require("../dbconfig");
const sql = require("mssql");

async function createTimesheet(data) {
  try {
    let pool = await sql.connect(config);
    let response = await pool
      .request()
      .input("work_date", sql.Date(), data.work_date)
      .input("work_hours", sql.Decimal(2, 0), data.work_hours)
      .input("work_detail", sql.NVarChar(sql.MAX), data.work_detail)
      .input("work_created_by", sql.VarChar(16), data.work_created_by)
      .execute("CreateTimesheet");

    if (response.recordsets.length > 0) {
      return { ...response.recordset[0] };
    } else {
      return undefined;
    }
  } catch (error) {
    return { ...error };
  }
}

async function getTimesheet(data) {
  try {
    let pool = await sql.connect(config);
    let response = await pool
      .request()
      .input("id", sql.NVarChar(20), data.id)
      .input("permission", sql.NVarChar(200), data.permission)
      .input("is_manager", sql.Bit, data.is_manager)
      .execute("GetAllTimesheet");

    if (response.recordsets.length > 0) {
      return response.recordset;
    } else {
      return undefined;
    }
  } catch (error) {
    return { ...error };
  }
}

async function getTimesheetByid(id) {
  try {
    let pool = await sql.connect(config);
    let response = await pool.query(`
    SELECT 
		    work_id,
        work_date,
        work_detail,
        work_hours
    FROM tb_work
    WHERE work_id = '${id}'
	  `);

    if (response.recordsets.length > 0) {
      return response.recordset[0];
    } else {
      return undefined;
    }
  } catch (error) {
    return { ...error };
  }
}

async function deleteTimesheetByid(id) {
  try {
    let pool = await sql.connect(config);
    let response = await pool.query(`
    DELETE 
    FROM tb_work
    WHERE work_id = '${id}'
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

async function updateTimesheet(data) {
  try {
    let pool = await sql.connect(config);
    let response = await pool
      .request()
      .input("work_date", sql.Date(), data.work_date)
      .input("work_detail", sql.NVarChar(sql.MAX), data.work_detail)
      .input("work_hours", sql.Decimal(2, 0), data.work_hours)
      .input("work_id", sql.VarChar(15), data.work_id)
      .execute("UpdateTimesheet");
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
  createTimesheet,
  getTimesheet,
  getTimesheetByid,
  deleteTimesheetByid,
  updateTimesheet,
};
