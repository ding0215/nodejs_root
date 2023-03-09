const { helper: hlp } = require("../helper/helper");
const helper = new hlp();

exports.encrypt = function (req, res) {
    const encrypted = helper.enc_dec("encrypt", req.body.data)

    let info_response = {
        'status': 200,
        'data': encrypted,
        'msg': ''
    }

    res.status(info_response.status).send(info_response)
}