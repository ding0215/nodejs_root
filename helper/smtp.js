const nodemailer = require('nodemailer')
require('dotenv').config();

const transporter = nodemailer.createTransport({
    // host: 'localhost',
    // port: 4444,
    service: "gmail",
    // secure: false,
    // tls: {
    //     rejectUnauthorized: false
    // },
    auth: {
        user: process.env.SMTP_USER,
        type: "OAUTH2",
        clientId: process.env.SMTP_CLIENT_ID,
        clientSecret: process.env.SMTP_CLIENT_SECRET,
        refreshToken: process.env.SMTP_REFRESH_TOKEN,
    }
})

exports.send_email = async function ({ from, to, subject, html }) {

    return send_email_promise = new Promise((resolve, reject) => {
        transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            html: html
        }, function (err, info) {
            if (err) {
                reject(err)
            }

            resolve(info)
        });
    });


}