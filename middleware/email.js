const nodemailer    = require('nodemailer');
const ejs           = require('ejs');
const sgMail        = require('@sendgrid/mail');
const {join}        = require('path');

require('dotenv').config();

// const transporter = nodemailer.createTransport({
//     service:'gmail',
//     auth:{
//         user : process.env.E_MAIL,
//         pass :process.env.PASS_WORD 
//     },
// });


// async function mailSending(mailData){
//     try{
//     transporter.sendMail(mailData,(err,data)=>{
//         if(err)
//         console.log('mail not sended'+err.message);
//         else
//         console.log('Mail sended');
//     })
// }catch(err){
//     console.log(err.message);
//     process.exit(1);
// }

// }

sgMail.setApiKey(process.env.SGMAIL_APIKEY);

async function mailSending(mailData){
    try{
        const data = await ejs.renderFile(join(__dirname ,'../templates/',mailData.fileName),mailData, mailData.details)
        const mailDetails = {
            from : mailData.from,
            to : mailData.to,
            subject : mailData.subject,
            //attachments : mailData.attachments,
            html : data
        }
    sgMail.send(mailDetails,(err,data)=>{
        if(err)
        console.log('mail sending failled'+err.message);
        else
        console.log('Mail send successfully');
    })
}catch(err){
    console.log(err.message);
    process.exit(1);
}

}


module.exports = {mailSending}