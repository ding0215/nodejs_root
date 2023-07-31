const CUR_ENV = 'dev';
const express = require("express");
const bodyParser = require("body-parser");
const router = require('./route/router');
const cors = require('cors');
const morgan = require('morgan')
const path = require('path')
const rfs = require('rotating-file-stream');
const { JsonWebTokenError } = require("jsonwebtoken");
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
})

morgan.token('req-body', function(req, res) {
    return JSON.stringify(req.body)
})

morgan.token('req-headers', function(req, res) {
    return JSON.stringify(req.headers)
})


const format = 'Date: :date[web] Method: :method Url: :url IP: :remote-addr Status: :status Request header: :req-headers Request body: :req-body Response time: :response-time ms Total time: :total-time ms'
// setup the logger
app.use(morgan(format, { stream: accessLogStream }))

app.use('/', router);

var server = app.listen(4444, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
});