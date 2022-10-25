const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const eventSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    venue:{
        type:String,
        required:true
    },
    host:{
        type:String,
        required:true
    },
    admin_id:{
        type:String,
        required:true
    }
});
const Event=mongoose.model('Event',eventSchema);
module.exports=Event;