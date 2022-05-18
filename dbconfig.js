const dotEnv = require('dotenv')

dotEnv.config()

const config = {
    user: process.env.USER,
    password: process.env.PASSWORD,
    server: process.env.HOST,
    database: process.env.DATABASE,
    options: {
        trustedconnection: true,
        enableArithAbort: true,
        instancename: process.env.DBINSTANCE,
    },
    port: Number(process.env.DBPORT)
}

module.exports = config