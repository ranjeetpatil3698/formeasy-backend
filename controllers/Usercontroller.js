const User=require('../models/userModel');
const Form=require('../models/formModel');
const Response=require('../models/responseModel');
var createError = require('http-errors');

exports.getAllFormsOfUser=async(req,res,next)=>{
    try{
        const {_id}=req.user;
        // console.log("res.cookie get all forms",req.cookies.jwt)
        const allForms=await Form.find({userid:_id});

        res.status(200).json({
            allForms
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error try again later"
        })
        // return next(new createError[501](["INTERNAL ERROR"]))
    }

}

exports.getAllResponsesOfForm=async(req,res,next)=>{
    try{
        const {url}=req.params;
        // console.log("res.cookie get all responses",req.cookies.jwt)
        const {_id}=await Form.findOne({formurl:url})
        const allResponses=await Response.find({formid:_id});

        res.status(200).json({
            allResponses
        })
        return;

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error try again later"
        })
        return;
        // return next(new createError[501](["INTERNAL ERROR"]))
    }

}

