const { query } = require('express');
const mysql = require('mysql');
const { helper: hlp } = require('../helper/helper');
require('dotenv').config();

const helper = new hlp();

module.exports = { model };

function model() {
    this.getWhere = getWhere;
    this.dataInsert = dataInsert;
    this.dataUpdate = dataUpdate;
    this.queryR = queryR;
}

function ConnectDatabase(host, user, password, database) {
    var con = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    });

    con.connect(function (err) {
        if (err) throw err;
    });

    return con;
}

const db = ConnectDatabase(process.env.HOSTNAME, process.env.USER_ID, process.env.PASSWORD, process.env.DATABASE);

async function getWhere(array) {

    const is_valid = await checkValidType(array);
    if (!is_valid) {
        return is_valid;
    }

    var condition = querys = table = ordering = limit = join = '';

    if (typeof array.table !== 'undefined' && array.table.length != 0) {
        table = array.table;
    }
    if (typeof array.select !== 'undefined' && array.select.length != 0) {
        select = array.select;
    } else {
        select = '*';
    }

    if (typeof array.join !== 'undefined' && typeof array.join == "object") {

        Object.keys(array.join).forEach(function (value, index) {
                join += " LEFT JOIN " +value + " ON " + array.join[value];
        });
        querys += join;
    }
    querys = 'SELECT ' + select + ' FROM ' + table + join;

    helper.preview(querys);

    if (typeof array.condition !== 'undefined' && typeof array.condition == "object") {

        Object.keys(array.condition).forEach(function (value, index) {
            if (Object.keys(array.condition).length - 1 == index) {
                condition += value + " = '" + array.condition[value] + "'";
            } else {
                condition += value + " = '" + array.condition[value] + "' AND ";
            }
        });
        querys += ' WHERE ' + condition;
    } else {
        if (array.condition !== 'undefined') {
            // console.log(array);
            querys += ' WHERE ' + array.condition;
        }

    }

    if (typeof array.ordering !== 'undefined' && array.ordering.length != 0) {
        ordering = array.ordering;
        querys += ' ORDER BY ' + ordering;
    }
    if (typeof array.limit !== 'undefined' && array.limit.length != 0) {
        limit = array.limit;
        querys += ' LIMIT ' + limit;
    }

    // helper.preview('lol');
    // helper.preview(querys);

    // db.query(querys.toString(), function (error, results, fields) {
    //     if (error) throw error;
    //     if (typeof array.row !== 'undefined' && array.row == 1) {
    //         callback(JSON.stringify(results[0]));
    //     } else {
    //         callback(JSON.stringify(results));
    //     }
    // });


    return new Promise(function (resolve, reject) {
        db.query(querys.toString(), function (error, results, fields) {
            if (error || results === undefined) throw error;

            // helper.preview(typeof array.row);
            if (typeof array.row !== 'undefined' && array.row == 1) {
                // resolve(query.toString());

                if (results.length === 0) {
                    resolve(results);
                    return;
                }
                // helper.preview(results[0].id);
                resolve(results[0]);
            } else {
                //     // helper.preview('lol');
                //     // resolve(query.toString());
                resolve(results);
            }

        });
    });
}

async function dataInsert(array) {
    var querys = table = col = data = '';
    if (typeof array.table !== 'undefined' && array.table.length != 0) {
        table = array.table;
    }

    querys = 'INSERT INTO ' + table + ' (';
    if (typeof array.data !== 'undefined' && array.data != []) {
        Object.keys(array.data).forEach(function (value, index) {
            if (Object.keys(array.data).length - 1 == index) {
                col += value + `)`;
                data += `'` + array.data[value] + `')`;
            } else if (index == 1 && Object.keys(array.data).length > 1) {
                col += value + `,`;
                data += `'` + array.data[value] + `',`;
            } else {
                col += value + `,`;
                data += `'` + array.data[value] + `',`;
            }
        });
        querys += col + ' VALUES (' + data;
    }

    // db.query(querys.toString(), function (error, results, fields) {
    //     if (error) throw error;
    //     array.select = 'id';
    //     array.condition = array.data;
    //     getWhere(array, function (result) {
    //         callback(result);
    //     });
    // });

    return new Promise(function (resolve, reject) {
        db.query(querys.toString(), async function (error, results, fields) {
            if (error || results === undefined) throw error;

            array.select = 'id';
            array.condition = array.data;
            array.row = 1;

            const lastInsertId = await getWhere(array);

            resolve(lastInsertId);

        });
    });
}
async function dataUpdate(array) {

    const is_valid = await checkValidType(array);

    if (!is_valid) {
        return is_valid;
    }

    var querys = table = data = condition = '';
    if (typeof array.table !== 'undefined' && array.table.length != 0) {
        table = array.table;
    }

    querys = 'UPDATE ' + table + ' SET ';
    if (typeof array.data !== 'undefined' && array.data != []) {
        Object.keys(array.data).forEach(function (value, index) {
            if (Object.keys(array.data).length - 1 == index) {
                data += value + '= "' + array.data[value] + `"`;
            } else {
                data += value + '= "' + array.data[value] + `",`;
            }
        });
        querys += data;
    }

    if (typeof array.condition !== 'undefined' && array.condition != []) {
        Object.keys(array.condition).forEach(function (value, index) {
            if (Object.keys(array.condition).length - 1 == index) {
                condition += value + '= "' + array.condition[value] + `"`;
            } else {
                condition += value + '= "' + array.condition[value] + `" AND `;
            }
        });
        querys += ' WHERE ' + condition;
    }

    // db.query(querys.toString(), function (error, results, fields) {
    //     if (error) throw error;
    //     array.select = 'id';
    //     array.condition = array.data;
    //     getWhere(array, function (result) {
    //         callback(result);
    //     });
    // });

    return new Promise(function (resolve, reject) {
        db.query(querys.toString(), async function (error, results, fields) {
            if (error || results === undefined) throw error;

            array.select = 'id';
            // array.condition = array.data;
            array.row == 1;

            const lastInsertId = await getWhere(array);

            resolve(lastInsertId);

        });
    });
}

function queryR(array, callback) {
    var querys = '';
    if (typeof array.data !== 'undefined') {
        querys = array.query;
    }

    return new Promise(function (resolve, reject) {
        db.query(querys.toString(), function (error, results, fields) {
            if (error) throw error;
            if (typeof array.row !== 'undefined' && array.row == 1) {
                if (results.length === 0) {
                    resolve(results);
                    return;
                }
                resolve(results[0]);
            } else {
                resolve(results);
            }
        });
    });
}


async function checkValidType(array) {

    const table = array["table"];
    const condition = array["condition"];

    if (condition === undefined || typeof condition === "string") {
        return true;
    }

    const JSON_column_data = await getFields(table);

    const column_data = JSON.parse(JSON_column_data);

    const filtered_data = column_data.filter((element) => {
        if (checkData(element.DATA_TYPE)) {
            return element;
        }
    });

    for (let index = 0; index < filtered_data.length; index++) {
        const element = filtered_data[index];

        if (condition[element.COLUMN_NAME] !== undefined) {
            column = condition[element.COLUMN_NAME];
            if (isNaN(column)) {
                return false;
            }
        }
        return true;
    }

    // console.log(filtered_data);
    // return filtered_data;
}

function getFields(table) {
    const query = "SELECT COLUMN_NAME, DATA_TYPE from INFORMATION_SCHEMA.COLUMNS where table_schema = '" + process.env.DATABASE + "' and table_name = '" + table + "'";
    // const query = "SELECT * FROM test";

    return new Promise(function (resolve, reject) {
        db.query(query.toString(), function (error, results, fields) {
            if (error || results === undefined) throw error;

            // callback(JSON.stringify(fields));

            resolve(JSON.stringify(results));

        });
    });

}


function checkData(data_type) {
    switch (data_type) {
        case 'int':
            return true;
        case 'tinyint':
            return true;
        case 'smallint':
            return true;
        case 'mediumint':
            return true;
        case 'bigint':
            return true;
        case 'decimal':
            return true;
        case 'float':
            return true;
        case 'double':
            return true;
        case 'bit':
            return true;
        default:
            return false;
    }
}





