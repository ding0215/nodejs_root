const testing_controller = require("../controller/testing_controller")
const express = require('express');
const router = express.Router();

router.post('/abc', testing_controller.testing)
router.get('/send', testing_controller.sendMail)

module.exports = router
