const express = require('express');
const router = express.Router();
const credential = require('../Controller/credential_controller');
const test = require('./test')

router.use('/credential',credential);
router.use('/test', test)

module.exports = router;

