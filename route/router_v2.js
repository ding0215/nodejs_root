const example_controller = require("../controller/example_controller")
const express = require('express');
const router = express.Router();

router.post('/abc', example_controller.testing)
router.get('/send', example_controller.sendEmail)
router.get('/query_example', example_controller.query_example)

module.exports = router
