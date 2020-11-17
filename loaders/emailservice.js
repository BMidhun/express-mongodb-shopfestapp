const nodemailer = require('nodemailer');

let mailTransport;

const initiateEmailTransport = () => {
    mailTransport = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });
}

const fetchEmailTransport = () => {
    return mailTransport;
}

module.exports = { initiateEmailTransport, fetchEmailTransport }