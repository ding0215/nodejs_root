const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = { jwtToken };

const jwtSecretKey = process.env.JWT_SECRET_KEY;

function jwtToken() {
    this.generateToken = generateToken;
    this.decodeToken = decodeToken;
    this.verifyToken = verifyToken;
}

function generateToken(data) {

    const dateObj = new Date();
    const currentTimeMlSec = dateObj.getTime();
    const addMlSec = process.env.TOKEN_EXP * 1000;
    const newDateTime = new Date(currentTimeMlSec + addMlSec).toISOString();

    if(typeof data !== "object"){
        return false;
    }

    data["EXP_API_TIME"] = newDateTime;

    const token = jwt.sign(JSON.parse(JSON.stringify((data))), jwtSecretKey);

    return token;

}

function verifyToken(token) {
    const decodedTokenData = jwt.verify(token, jwtSecretKey);
    return decodedTokenData;
}

function decodeToken(token) {
    const decodedTokenData = jwt.decode(token, jwtSecretKey);
    return decodedTokenData;
}

