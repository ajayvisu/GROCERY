const {totp}        = require("otplib");
const fast2sms      = require('fast-two-sms');


require('dotenv').config();
// fast2sms.setApiKey(process.env.F2S_APIKEY);

// function Otp(){
//     const secreatKey = 'F2S_APIKEY'
//     console.log(secreatKey)
//     console.log(token)
// }

function verifyotp (type) {
    if ( type == 'send'){
        const secretkey ="F2S_APIKEY";
    const token = totp.generate (secretkey)
    console.log ("token:"+ token)
    return token
    }else if(type == 'resend'){
        const secretkey= 'F2S_APIKEY'
        const token = totp.generate(secretkey)
        console.log("resend token:"+ token)
        return token
    }
    
}
function verify(){
    const secreatKey ='F2S_APIKEY'
    const token = totp.generate(secreatKey)
    console.log(secreatKey)
    console.log(token)
    const compare = totp.check(token, secreatKey)
    console.log(compare)

}
verifyotp()
verify()

module.exports = {verifyotp, verify}