const express = require('express');
const router = express.Router();
const credential = require('../Controller/credential_controller');
const test = require('./test')
const lucky_draw = require('./lucky_draw')
const helper = require('./helper')

router.use('/credential',credential);
router.use('/test', test)
router.use('/helper', helper)
router.use('/lucky', lucky_draw)

module.exports = router;

