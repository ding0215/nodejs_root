const testing_controller = require("../controller/testing_controller")
const express = require('express');
const router = express.Router();

router.get('/abc', testing_controller.testing)
router.get('/send', testing_controller.sendMail)
router.get('/testing_db', testing_controller.testing_db)

module.exports = router
