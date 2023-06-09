const example_controller = require("../controller/example_controller")
const express = require('express');
const router = express.Router();

router.post('/wss_enc_dec', example_controller.wss_enc_dec)

module.exports = router
