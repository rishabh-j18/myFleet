const mongoose=require('mongoose');

const providerSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    dob:{
        type:Date,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true,
        unique:true
    },
    address:{
        type:String
    },
    age:{
        type:String
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    carinfo: [
        {
          car: {
            type: String,
          },
          model: { type: String },
          color: { type: String },
        },
      ],

});

const Provider=mongoose.model('PROVIDER',providerSchema);

module.exports=Provider;