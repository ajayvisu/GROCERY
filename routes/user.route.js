const router        = require('express').Router();
const bcrypt        = require('bcrypt');
const jwt           = require('jsonwebtoken');
const moment        = require('moment');
const { Admin }     = require('mongodb');
const schema        = require('../models/user.model');
const {joiSchema}   = require("../validation/joiSchema");
const mail          = require('../middleware/email');


router.post('/register',async(req,res) =>{
try{

const userName=req.body.userName;
const email=req.body.email;
const mobileNumber=req.body.mobileNumber;
const password=req.body.password;

 if(userName && email && mobileNumber && password){
    
 let userDetails=await schema.findOne({'userName':userName}).exec()
 let emailid=await schema.findOne({'email':email}).exec()
 let phn=await schema.findOne({'mobileNumber':mobileNumber}).exec()
console.log("userName",userDetails);
console.log("email",emailid);
console.log("mobileno",phn);
const newresult =  await  joiSchema.validateAsync(req.body)
 if(userDetails){
    return res.json({status:"failure",message:"username already exist"})
  }else if(emailid){
    return res.json({status:"failure",message:"email already exist"})
  }else if(phn){
    return res.json({status:"failure",message:"mobileno already exist"})
  }else{

   
    let user = new schema(req.body);
    let salt = await bcrypt.genSalt(10);
    user.password = bcrypt.hashSync(password, salt);
    console.log(user.password);
    let result=await user.save();
    

    // const authdataSchema = joi.object({
    //      userName:joi.string().pattern(new RegExp(/^[A-Za-z]+[0-9]{3}+$/)).min(4).max(20).required(),
    //      email:joi.string().pattern(new RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)).required(),
    //      mobilenumber:joi.string().length(10).pattern(new RegExp(/^[0-9]{10}+$/)).required(),
    //      password:joi.string().min(3).required(),
    // });
    // let  result=authdataSchema.validate(req.body)
    // res.send(result)

    return res.status(200).json({status:"success",message:"user details added  successfully",data:result})
  }
}
 else{
        return res.status(400).json({status:"failure",message:"must include all details"})
    }    
}catch(error){
    console.log(error.message);
    return res.status(500).json({status:"failure",message:error.message})
}
})
//login
router.post('/loginpage',async(req,res)=>{
    try{
        let userName = req.body.userName;
        let password = req.body.password;
     let userDetails;
     let details=await schema.findOne({username:userName}).select('-username -_id ').exec()
    if(userName){
        userDetails=await schema.findOne({userName:userName}).exec()
        if(!userDetails){
            return res.status(400).json({status: "failure", message: "Don't have an account?please Register"});
        }else if(userDetails){
            console.log(userDetails.password)
            let match=await bcrypt.compare(password,userDetails.password);
            console.log("match",match)
            console.log("password",password)
            if(userDetails.firstLoginStatus !== true){
                await schema.findOneAndUpdate({uuid:userDetails.uuid},{firstLoginStatus:true},{new:true}).exec()
            }
            let payload = {uuid: userDetails.uuid,role:userDetails.role}
           // let payload = {uuid: userDetails.uuid,role:Admin}
            if(match){
               let userDetails=details.toObject()//to append jwt token
               let jwttoken = jwt.sign(payload, process.env.secretKey)
               userDetails.jwttoken = jwttoken
               await schema.findOneAndUpdate({uuid: userDetails.uuid}, {loginStatus: true}, {new:true}).exec()
                return res.status(200).json({status: "success", message: "Login successfully",data:{userDetails,jwttoken}})
            }else{
                return res.status(200).json({status: "failure", message: "Login failed"})
            }
            }
        }
    
    }catch(error){
        console.log(error.message)
        return res.status(500).json({status: "failure", message: error.message})
    }
})

//logout
router.post("/logout/:uuid",async(req,res)=>{
    try{

        let date = moment().toDate()
        console.log(date)
        await schema.findOneAndUpdate({uuid: req.params.uuid}, {lastedVisited: date,loginStatus: false}, {new:true}).exec()
        return res.status(200).json({status: "success", message: "Logout success"}) 
    }catch(error){
        console.log(error.message)
        return res.status(500).json({status: "failure", message: error.message})
    }
})

//email
router.post('/sendMail',async(req,res ) =>{
    try{
         const toMail = req.body.toMail
         const subject = req.body.subject
         const text = req.body.text
         var mailData={
            from:'ajay.platosys@gmail.com',
            to :toMail,
            subject:subject,
            text:text
        }
        let data = await mail.mailSending(mailData);
         return res.status(200).json({status: "success", message: "email sent successfully"})
          
    }catch(err){
        res.json({status:'failled',message:err.message})
    }
})

module.exports = router;