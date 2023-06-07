const nodemailer = require('nodemailer');
const os = require('os');
const fs = require('fs').promises;
const path = require('path');
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

exports.send_email = async function ({ from, to, subject, templateData }) {

    // const templatePath = "~/7ech_project/nodejs_root/email_template/email_template.html"
    const templatePath = path.join(os.homedir(), '7ech_project', 'nodejs_root', 'email_template', 'email_template.html');

    // Read the template file asynchronously
    const html = await fs.readFile(templatePath, 'utf8');

    // Replace placeholders in the HTML with dynamic data
    const compiledHtml = html.replace(/{{(\w+)}}/g, (match, key) => {
        return templateData[key] || '';
    });


    return send_email_promise = new Promise((resolve, reject) => {
        transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            html: compiledHtml
            // html: html
        }, function (err, info) {
            if (err) {
                reject(err)
            }

            resolve(info)
        });
    });


}