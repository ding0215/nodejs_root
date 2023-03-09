const testing_controller = require("../controller/testing_controller")
const express = require('express');
const router = express.Router();

router.post('/abc', testing_controller.testing)
router.get('/send', testing_controller.sendMail)
router.get('/testing_db', testing_controller.testing_db)
router.get('/testing_axios', testing_controller.testing_axios)

module.exports = router
