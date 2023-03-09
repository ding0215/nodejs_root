const helper_controller = require("../controller/helper_controller")
const express = require('express');
const router = express.Router();

router.post('/encrypt', helper_controller.encrypt)

module.exports = router
