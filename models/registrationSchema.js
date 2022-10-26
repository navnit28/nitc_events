const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const registrationSchema=new Schema({
    event_id:{
        type:String,
        required:true,
        index:true
    },
    user_email:{
        type:String,
        required:true,
        index:true
    },
}
);
const Registration=mongoose.model('Registration',registrationSchema);
module.exports=Registration;
