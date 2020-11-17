const mailService = require('../loaders/emailservice');

module.exports = (mailOption) => {
    try {

        mailService.fetchEmailTransport().sendMail(mailOption);
        return true;
    } catch (error) {
        console.log(error);
        return false
    }


}