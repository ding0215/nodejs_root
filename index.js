const CUR_ENV = 'dev';
const express = require("express");
const bodyParser = require("body-parser");
const router = require('./route/router');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/', router);

var server = app.listen(1234, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
});