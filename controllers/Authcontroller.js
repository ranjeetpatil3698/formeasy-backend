const User=require('../models/userModel');
const jwt=require('jsonwebtoken');
const {promisify}=require('util')
var createError = require('http-errors');

const signToken=id=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}

const createSendToken=(user,statuscode,req,res)=>{
    const token=signToken(user._id);

    const cookieOptions={
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
        httpOnly:true
    }

    res.cookie('jwt',token,cookieOptions);
    res.status(statuscode).json({
        status:'success',
        token,
        // data:{
        //     user
        // }
    })
}

exports.signup=async (req,res,next)=>{
    try{
    const {name,email,password,passwordConfirm}=req.body;
    const newUser=await User.create({
        name,email,password,passwordConfirm
    });
    
    createSendToken(newUser,201,req,res);
    }catch(err){
        console.log(err)
        next(new createError[500](["Internal server error"]))
    }
}

exports.login=async (req,res,next)=>{
    try{
    const {email,password}=req.body;

    if(!email || !password){
        res.status(400).json({
            message:"please give email or password"
        })
        // return next(new createError[401](["please give email or password"]));
    }

    const user=await User.findOne({email}).select('+password');

    if(!user || !(await user.correctPassword(password,user.password))){
        res.status(400).json({
            message:"user doesn't exist or incorrect password is incorrect"
        })
        // return next(new createError[404](["no user found"]))
    }

    createSendToken(user,200,req,res);

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error try again later"
        })
        // return next(new createError[404](["no user found"]))
    }
}

exports.protect=async (req,res,next)=>{
    
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token=req.headers.authorization.split(' ')[1] 
    console.log("token form the header ",token)
    }else if(req.cookies.jwt){
        token=req.cookies.jwt;
        // console.log("token form the cookie ",token)
    }

    if(!token){
        res.status(401).json({
            message:"Youre not authorized please sign in or log in"
        })
        // return next(new createError[401](["No token found"]))
    }

    
    const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    // console.log("decoded token ",decoded);

    const currentUser=await User.findById(decoded.id);
    // console.log("current user ",currentUser);

    if(!currentUser){
        res.status(400).json({
            message:"No such user exists please sign up"
        })
        // return next(new createError[401](["No user found"]));
    }
    
        req.user=currentUser;

    next();
};

exports.oneuser=async(req,res)=>{
    const {email}=req.body;
    // console.log(req.user)
    const user=await User.findOne({email});

    res.status(200).json({
        user
    })
}

