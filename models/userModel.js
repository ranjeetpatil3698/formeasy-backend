const crypto=require('crypto');
const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"]
    },
    email:{
        type:String,
        required:[true,"Please provide your email"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,"Please provide your email"]
    },
    password:{
        type:String,
        required:[true,"Please provide your password"],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,"Please confirm your password"],
        //works on .save(),.create() not on update and all other stuffs
        validate:{
            validator:function(el){
                return el===this.password
            },
            message:"Passwords are not same"
        }
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
});

userSchema.pre('save',async function(next){
if(!this.isModified('password')) return next();
this.password=await bcrypt.hash(this.password,12);
this.passwordConfirm=undefined;
next();
});

userSchema.methods.correctPassword=async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}


const User=mongoose.model('User',userSchema);

module.exports=User;