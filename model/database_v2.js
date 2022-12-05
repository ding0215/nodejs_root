const mysql = require('mysql');
const { helper: hlp } = require('../helper/helper');
require('dotenv').config();

const helper = new hlp();

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

function ConnectDatabase(host, user, password, database) {
    // var con = mysql.createPool({
    //     host: host,
    //     user: user,
    //     password: password,
    //     database: database,

    // });

    // con.getConnection((err, connection) => {
    //     if (err)
    //         throw err;
    //     console.log('Database connected successfully');
    //     connection.release();
    // });

    // var con = mysql.createConnection({
    //     host: host,
    //     user: user,
    //     password: password,
    //     database: database
    // });

    // con.connect(function (err) {
    //     if (err) throw err;
    // });

    // return con;
}

const db = ConnectDatabase(process.env.HOSTNAME, process.env.USER_ID, process.env.PASSWORD);

function raw_query(query, callback) {

    return new Promise(function (resolve, reject) {
        db.query(query.toString(), function (error, results, fields) {
            if (error) {
                reject(error)
            }
            resolve(results)
        });
    });
}





