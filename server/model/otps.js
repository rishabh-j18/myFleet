const mongoose=require('mongoose');

const otpSchema=new mongoose.Schema({
    mobile:{
        type:Number,
        required:true,
        unique:true
    },
    otp:{
        type:String,
        required:true
    },
    otpexpire:{
        type:Number,
        required:true
    }
})

const otps=mongoose.model('otp',otpSchema);

module.exports= otps;