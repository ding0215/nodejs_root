
const { model } = require("../model/database");
const { helper: hlp } = require("../helper/helper");
const express = require('express');
const { middleware } = require("../middleware/middleware");
// const 
const router = express.Router();

const db = new model();
const helper = new hlp();
const mw = new middleware();

router.post('/signIn', sign_in_middleware, signIn);
router.post('/signUp', sign_up_middleware, mw.check_signup_duplicate, signUp);

router.get('/test', async function (req, res) {
    const query = "select * from Onesoft_common.User"
    const result = await db.raw_query(query);

    return res.send(result);
})

async function signIn(req, res) {
    // helper.preview(req.body.email);
    let array = {
        'table': 'Admin',
        'select': 'id,username',
        'condition': {
            'email': req.body.email,
            'password': helper.encrypt_decrypt('encrypt',req.body.password),
        },
        'row': 1
    }
    // helper.preview(array);
    const result = await db.getWhere(array);

    // helper.preview(result);

    let info_response = {
        'status': 200,
        'data': [],
        'msg': ''
    };

    if (!result && typeof result === "boolean") {
        info_response = {
            'status': 400,
            'data': [],
            'msg': 'SQL qeury error'
        }

        return res.status(info_response.status).send(info_response);
    }

    if (Object.keys(result).length < 1) {
        info_response = {
            'status': 400,
            'data': [],
            'msg': 'WRONG_EMAIL_PASSWORD'
        };

        return res.status(info_response.status).send(info_response);
    }

    result.token = helper.genLoginToken(result);

    info_response = {
        'status': 200,
        'data': result,
        'msg': 'Get success'
    }

    return res.status(info_response.status).send(info_response);
}

async function signUp(req, res) {

    // helper.preview(new Date().toISOString());

    let array = {
        'table': 'Admin',
        'data': {
            'username': req.body.username,
            'email': req.body.email,
            'password': helper.encrypt_decrypt('encrypt', req.body.password),
            'created_at': helper.getCurrentDate(),
            'created_by': req.body.username,
        }
    };

    const result = await db.dataInsert(array);

    // helper.preview(result[0]);

    let array_detail = {
        'table' : 'Admin_detail',
        'data'  : {
            'admin_id'      : result.id,
            'created_at'    : helper.getCurrentDate(),
            'created_by'    : result.id,
        }
    };

    const result_detail = await db.dataInsert(array_detail);
    let info_response = {
        'status': 200,
        'data': [],
        'msg': ''
    };


    if (!result || !result_detail) {
        info_response['status'] = 400;
        info_response['msg'] = "Insert failed";

        return res.status(info_response.status).send(info_response);
    }

    info_response['msg'] = "Insert Success";

    return res.status(info_response.status).send(info_response);

}

function sign_up_middleware(req, res, next) {
    let info_response = {
        'status': 400,
        'data': [],
        'msg': ''
    }

    if (Object.keys(req.body).length === 0) {
        info_response['msg'] = "Body is empty!";
        return res.status(400).send(info_response);
    }

    if (req.body.email === undefined || req.body.email === "") {
        info_response['msg'] = "Email is empty!";
        return res.status(400).send(info_response);
    }

    if (req.body.password === undefined || req.body.password === "") {
        info_response['msg'] = "Password is empty!";
        return res.status(400).send(info_response);
    }

    if (req.body.username === undefined || req.body.username === "") {
        info_response['msg'] = "Username is empty!";
        return res.status(400).send(info_response);
    }

    next();
}

function sign_in_middleware(req, res, next) {
    let info_response = {
        'status': 400,
        'data': [],
        'msg': ''
    }

    if (Object.keys(req.body).length === 0) {
        info_response['msg'] = "Body is empty!";
        return res.status(400).send(info_response);
    }

    if (req.body.email === undefined || req.body.email === "") {
        info_response['msg'] = "Email is empty!";
        return res.status(400).send(info_response);
    }

    if (req.body.password === undefined || req.body.password === "") {
        info_response['msg'] = "Password is empty!";
        return res.status(400).send(info_response);
    }

    next();
}

function test_token(req, res) {
    const token = req.body.token;
    return token;
}



module.exports = router;
