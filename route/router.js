const express = require('express');
const router = express.Router();
const credential = require('./Controller/credential_controller');

router.use('/credential',credential);

module.exports = router;

