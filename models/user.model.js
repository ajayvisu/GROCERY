const mongoose = require('mongoose')
const crypto = require('crypto');
const { string } = require('joi');

const userSchema = new mongoose.Schema({
    uuid : {type: String, required : false},
    userName:{type:String,required:true},
    email:{type:String,required:true,trim:true,unique:true},
    mobileNumber:{type:String,required:true},
    password:{type:String,required:true},
    role:{type: String, enum:['admin', 'user'], required: false, default: 'admin'},
    lastedVisited: {type: String, required: false},
    loginStatus:{type: Boolean, required: false, default: false},
    firstLoginStatus:{type: Boolean, required: false, default: false},
    otp:{type: String, required : false}
},{
    timestamps:true
})

userSchema.pre('save',function(next){
    this.uuid='USER-'+crypto.pseudoRandomBytes(4).toString('hex').toUpperCase()
    console.log(this.uuid);
    next();
})

module.exports = mongoose.model('user',userSchema);