var config = require('../dbconfig')
const sql = require("mssql")

async function getAllIncome() {
    try {
        let pool = await sql.connect(config)
        let response = await pool.request()
            .execute('GetIncome')
        return response.recordset
    } catch (error) {
        console.log(error)
    }
}

async function getAllIncomeDetail() {
    try {
        let pool = await sql.connect(config)
        let response = await pool.request()
            .execute('GetIncomDetail')
        return response.recordset
    } catch (error) {
        console.log(error)
    }
}

async function createIncome(data) {
    try {
        let pool = await sql.connect(config)
        let response = await pool.request()
            .input('amount', sql.Decimal(3, 0), +data.calAmount)
            .input('price', sql.Decimal(10, 2), +(data.calTotal).toFixed(2))
            .input('emp_id', sql.NVarChar(16), data.emp_id)
            .execute('CreateIncome')

        await createIncomeDetail(data.bill, response.recordset[0].income_id)
        return response.recordset
    } catch (error) {
        console.log(error);
    }
}

async function createIncomeDetail(data, billNo) {
    try {
        let pool = await sql.connect(config)
        let response = await data.map(dl => {
            return pool.request()
                .input('ref_bill', sql.NVarChar(sql.MAX), billNo)
                .input('ref_prod_name', sql.NVarChar(200), dl.name)
                .input('ref_prod_price', sql.Decimal(10, 2), Number(dl.price) * Number(dl.amount))
                .input('ref_prod_amount', sql.Decimal(3, 0), dl.amount)
                .execute('CreateIncomeDetail')
        });

        return response.recordset

    } catch (error) {
        console.log(error);

    }
}

module.exports = {
    createIncome,
    createIncomeDetail,
    getAllIncome,
    getAllIncomeDetail,
}