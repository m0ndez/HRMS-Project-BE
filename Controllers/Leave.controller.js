var config = require("../dbconfig");
const sql = require("mssql");

async function createLeavesheet(data) {
  try {
    let pool = await sql.connect(config);
    let response = await pool
      .request()
      .input("leave_start", sql.Date(), data.leave_start)
      .input("leave_end", sql.Date(), data.leave_end)
      .input("leave_remark", sql.Int(), data.leave_remark)
      .input("leave_created_by", sql.VarChar(16), data.leave_created_by)
      .execute("CreateLeave");

    if (response.recordsets.length > 0) {
      return { ...response.recordset[0] };
    } else {
      return undefined;
    }
  } catch (error) {
    return { ...error };
  }
}

// Not use anymore
// async function updateLeavesheet(data) {}

async function getLeavesheet(data) {
  try {
    let pool = await sql.connect(config);
    let response = await pool
      .request()
      .input("id", sql.NVarChar(20), data.id)
      .input("permission", sql.NVarChar(200), data.permission)
      .input("is_manager", sql.Bit, data.isManager)
      .execute("GetAllLeavesheet");

    if (response.recordsets.length > 0) {
      return response.recordset;
    } else {
      return undefined;
    }
  } catch (error) {
    return { ...error };
  }
}

async function deleteLeavesheet(id) {
  try {
    let pool = await sql.connect(config);
    let response = await pool.query(`
        DELETE 
        FROM tb_leave
        WHERE leave_id = '${id}'
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

async function getLeaveApprove() {
  try {
    let pool = await sql.connect(config);
    let response = await pool.request().execute("GetLeaveApproveList");

    if (response.recordsets.length > 0) {
      return response.recordset;
    } else {
      return undefined;
    }
  } catch (error) {
    return { ...error };
  }
}

async function updateLeaveStatus(data) {
  try {
    const { state, id } = data;
    console.log(state, id);
    let pool = await sql.connect(config);
    let response = await pool.query(`
        UPDATE tb_leave 
        SET 
        leave_approved = ${state ? 1 : 0}
        WHERE leave_id = '${id}'
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

module.exports = {
  createLeavesheet,
  getLeavesheet,
  deleteLeavesheet,
  getLeaveApprove,
  updateLeaveStatus,
};
