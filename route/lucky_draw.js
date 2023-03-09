const lucky_draw_controller = require("../controller/lucky_draw_controller.js")
const express = require('express');
const router = express.Router();

router.post('/lucky_draw', lucky_draw_controller.luckydraw_middleware, lucky_draw_controller.luckydraw)

module.exports = router
