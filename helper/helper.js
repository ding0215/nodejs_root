const crypto = require('crypto');
const { jwtToken } = require('../token/token');
const dateObj = new Date();

module.exports = { helper };

const objToken = new jwtToken();

function helper() {
    this.preview = preview;
    this.encrypt_decrypt = encrypt_decrypt;
    this.enc_dec = enc_dec;
    this.base64_encode_decode = base64_encode_decode;
    this.genLoginToken = genLoginToken;
    this.getTokenData = getTokenData;
    this.getCurrentDate = getCurrentDate;
}

function preview(data) {
    console.log(JSON.stringify(data, null, 2));
}

function enc_dec(action, string) {
    let output = false;

    const encrypt_method = '    ';
    const secret_key = 'This is my secret key:!super@duper#hyper$';
    const secret_iv = 'This is my secret iv:!super@duper#hyper$';

    const key = crypto.createHash('sha256').update(secret_key).digest('hex').substring(0, 32);
    const iv = crypto.createHash('sha256').update(secret_iv).digest('hex').substring(0, 16);

    const blockSize = iv.length / 2;

    if (action === 'encrypt') {
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let crypt = cipher.update(string, 'utf8', 'base64');
        crypt += cipher.final("base64");
        output = crypt
    }

    if (action === 'decrypt') {
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypt = decipher.update(string, 'base64', 'utf8');
        decrypt += decipher.final();
        output = decrypt
    }

    return output;
}

function encrypt_decrypt(action, string) {
    let output = "";

    if (action === "encrypt") {
        const first_encrypt = enc_dec(action, string);
        console.log(first_encrypt);
        output = enc_dec(action, first_encrypt);
    }

    if (action === "decrypt") {
        const first_decrypt = enc_dec(action, string);
        output = enc_dec(action, first_decrypt);
    }

    return output;
}

/// Encode use "encode" and Decode use "decode" for first param
function base64_encode_decode(action, string) {
    let output = "";
    if (action === "encode") {
        output = Buffer.from(string).toString("base64");
    }

    if (action === "decode") {
        output = Buffer.from(string, 'base64').toString('ascii');
    }

    return output;
}

function genLoginToken(data) {
    return objToken.generateToken(data);
}

function getTokenData(token) {
    return objToken.verifyToken(token);
}

function getCurrentDate() {
    let year = dateObj.getFullYear();

    let month = dateObj.getMonth();
    month = ('0' + month).slice(-2);
    // To make sure the month always has 2-character-formate. For example, 1 => 01, 2 => 02

    let date = dateObj.getDate();
    date = ('0' + date).slice(-2);
    // To make sure the date always has 2-character-formate

    let hour = dateObj.getHours();
    hour = ('0' + hour).slice(-2);
    // To make sure the hour always has 2-character-formate

    let minute = dateObj.getMinutes();
    minute = ('0' + minute).slice(-2);
    // To make sure the minute always has 2-character-formate

    let second = dateObj.getSeconds();
    second = ('0' + second).slice(-2);
    // To make sure the second always has 2-character-formate

    const time = `${year}-${month}-${date} ${hour}:${minute}:${second}`;

    return time;
}
