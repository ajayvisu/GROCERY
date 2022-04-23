const mongoose  = require("mongoose");
const crypto    = require("crypto");

const categorySchema = new mongoose.Schema({
    uuid:{type: String, required: false},
    categoryName: {type: String, required: true, trim: true},
    userUuid: {type: String, required: true}

},
{
    timestamps:true
});

//uuid generation
categorySchema.pre('save',function(next){
    this.uuid='CATE-'+crypto.pseudoRandomBytes(6).toString('hex').toUpperCase()
    console.log(this.uuid)
    next();
})

module.exports = mongoose.model('category',categorySchema);