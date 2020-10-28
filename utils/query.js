const mysql = require('mysql');
const MySqlConfig = require('../config/mySqlConfig.js');
const pool = mysql.createPool(MySqlConfig);
const query = (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {

            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, fields) => {
                    if (err) reject(err)
                    else resolve(fields)
                    connection.release();
                })
            }
        })
    })
}

module.exports = query;