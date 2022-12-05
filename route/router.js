const express = require('express');
const router = express.Router();
const router_v2 = require('./router_v2')

router.use('/router_v2', router_v2)

module.exports = router;

