// module.exports = { middleware };
const { helper: hlp } = require("../helper/helper");
const helper = new hlp();
const { model } = require("../model/database");
const db = new model();

exports.middleware = {
    check_auth_middleware,
    // check_signup_duplicate,
    // checkPassword,
    common_middleware,
    // check_super_admin
}

function check_auth_middleware(req, res, next) {

    const token = req.headers.authorization;
    helper.preview('lol');
    let info_response = {
        'status': 400,
        'data': [],
        'msg': ''
    }

    if (token === undefined || token === "") {
        info_response['msg'] = "TOKEN_EMPTY";

        return res.status(info_response.status).send(info_response);
    }

    const jwtData = helper.getTokenData(token);

    const current_time = new Date().getTime();

    const tokenTime = new Date(jwtData.EXP_API_TIME).getTime();
    
    if (jwtData instanceof Error) {
        info_response['msg'] = jwtData.message;

        return res.status(info_response.status).send(info_response);
    }

    if (tokenTime < current_time) {
        info_response['msg'] = "TOKEN_EXPIRED";

        return res.status(info_response.status).send(info_response);
    }

    next();
}

// example
// async function check_super_admin(req, res, next) {
//     const token = req.headers.authorization;
//     const jwtData = helper.getTokenData(token);

//     let array = {
//         'table': 'Admin',
//         'select': 'id',
//         'condition': {
//             'id': jwtData.id,
//             'role': 1,
//         },
//         'row': 1,
//     }

//     result = await db.getWhere(array);

//     if (Object.keys(result).length < 1) {
//         info_response = {
//             'status': 400,
//             'data': [],
//             'msg': 'NO_SUCH_SUPER_ADMIN'
//         };
//         return res.status(info_response.status).send(info_response);
//     }

//     if ((!result && typeof result === "boolean") || typeof result === "undefined") {
//         info_response = {
//             'status': 400,
//             'data': [],
//             'msg': 'SQL qeury error'
//         }
//         return res.status(info_response.status).send(info_response);
//     }

//     next();
// }

function common_middleware(req, res, next) {
    if (Object.keys(req.body).length === 0) {
        let info_response = {
            'status': 400,
            'data': [],
            'msg': 'Body is empty!'
        }
        return res.status(400).send(info_response);
    }

    next();
}

// example
// async function check_signup_duplicate(req, res, next) {
//     let array = {
//         'table': 'Admin',
//         'select': 'id',
//         // 'condition' : "email = '" + req.body.email + "' or username = '" + req.body.username + "'",
//         'row': 1

//     }

//     if (req.body.email.length !== 0 && req.body.username.length === 0) {
//         array.condition = {
//             'email': req.body.email,
//         };
//     } else if (req.body.username.length !== 0 && req.body.email.length === 0) {
//         array.condition = {
//             'username': req.body.username,
//         };
//     } else if (req.body.username.length !== 0 && req.body.email.length !== 0) {
//         array.condition = "email = '" + req.body.email + "' or username = '" + req.body.username + "'";
//     }
//     const result = await db.getWhere(array);
//     // helper.preview(result);
//     let info_response = {
//         'status': 200,
//         'data': [],
//         'msg': ''
//     };

//     let length = Object.keys(result).length;
//     // helper.preview(length);
//     if (!result) {
//         info_response['status'] = 400;
//         info_response['msg'] = "Data_type_wrong";

//         return res.status(info_response.status).send(info_response);
//     }

//     if (length > 0) {
//         info_response['status'] = 400;
//         info_response['msg'] = "Email_Username_Duplicate";

//         return res.status(info_response.status).send(info_response);
//     }

//     next();
// }

// example
// async function checkPassword(req, res, next) {
//     // const token = req.headers.authorization;
//     // const jwtData = helper.getTokenData(token);

//     // helper.preview(helper.encrypt_decrypt('encrypt', req.body.old_password));
//     let array = {
//         'table': 'Admin',
//         'select': 'id',
//         'condition': {
//             'id': req.body.id,
//             'password': helper.encrypt_decrypt('encrypt', req.body.old_password)
//         }
//     }

//     // helper.preview(array);
//     const result = await db.getWhere(array);

//     // helper.preview(result);
//     let info_response = {
//         'status': 200,
//         'data': [],
//         'msg': ''
//     };

//     if (!result) {
//         info_response['status'] = 400;
//         info_response['msg'] = "Data_type_wrong";

//         return res.status(info_response.status).send(info_response);
//     }

//     if (Object.keys(result).length < 1) {
//         info_response['status'] = 400;
//         info_response['msg'] = "Old_password_wrong";


//         return res.status(info_response.status).send(info_response);
//     }
//     next();
// }

