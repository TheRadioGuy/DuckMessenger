'use strict';
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'duckmessenger@csduck.ru',
        pass: 'mixa79'
    }
});




module.exports.SendEmailMessage = function(to, subject, text, html){
return new Promise(function(resolve, reject){


    // setup email data with unicode symbols
let mailOptions = {
    from: 'duckmessenger@csduck.ru', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html// html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    
        if (error) {
        console.log(error);
        resolve(false);
        return;
    }
    console.log('Message sent');
    console.log(info);
    
    
});



});
};