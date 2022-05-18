var config = require('./dbconfig')
const sql = require("mssql")


async function getEmployee() {
    try {
        let pool = await sql.connect(config)
        let products = await pool.request().query('SELECT * FROM Employee')
        return products.recordsets;
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    getEmployee
}