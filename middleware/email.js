const nodemailer = require('nodemailer');
const ejs = require('ejs');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user : process.env.E_MAIL,
        pass :process.env.PASS_WORD 
    },
});


async function mailSending(mailData){
    try{
    transporter.sendMail(mailData,(err,data)=>{
        if(err)
        console.log('mail not sended'+err.message);
        else
        console.log('Mail sended');
    })
}catch(err){
    console.log(err.message);
    process.exit(1);
}

}


module.exports = {mailSending}