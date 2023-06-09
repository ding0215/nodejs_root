const express = require('express');
const router = express.Router();
const router_v2 = require('./router_v2')
const fnc = require('./function')

router.use('/router_v2', router_v2)
router.use('/function', fnc)

module.exports = router;

