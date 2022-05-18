var config = require('../dbconfig')
const sql = require("mssql")


async function getProuduct(id) {
    try {
        let pool = await sql.connect(config)
        let response = await pool.request()
            .input('id', sql.VarChar(10), ['', null, undefined].includes(id) ? null : id)
            .execute('GetProduct')
        return response.recordset
    } catch (error) {
        console.log(error);
    }
}

async function createProduct(data) {
    try {
        let pool = await sql.connect(config)
        let response = await pool.request()
            .input('productName', sql.NVarChar(200), data.productName)
            .input('productDetail', sql.NVarChar(200), data.productDetail)
            .input('productPrice', sql.Decimal(10, 2), Number(data.productPrice).toFixed(2))
            .input('productAmount', sql.Decimal(3, 0), Number(data.productAmount).toFixed(2))
            .input('productImg', sql.NVarChar(sql.MAX), data.productImg)
            .execute('CreateProduct')
        return response.recordset
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getProuduct,
    createProduct
}