const mysql = require('mysql');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.HOSTNAME,
    user: process.env.USER_ID,
    password: process.env.PASSWORD,
    connectionLimit: 10,
})

exports.raw_query = function (query, db = process.env.DATABASE) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {

            if (err) {
                reject(err);
            }

            //change database
            connection.changeUser({
                database: db
            }, function (err) {
                if (err) {
                    reject(err);
                }

                connection.query(query.toString(), function (error, results, fields) {
                    if (error) {
                        reject(error)
                    }

                    resolve(results)
                })

                connection.release();
            })


        })
    })
}





