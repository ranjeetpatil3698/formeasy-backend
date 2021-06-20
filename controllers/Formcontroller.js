var createError = require('http-errors');
var fs = require('fs');
let Form=require('../models/formModel');
let Response=require('../models/responseModel');

exports.createform=async (req,res,next)=>{
    try{
    const {bodyname,formelements,data}=req.body;
    const {user}=req;
    const newform=await Form.create({
        fname:bodyname,
        formelements,
        userid:user._id,
        data
    })
    const {_id,fname}=newform;

    await Response.create({
        formid:_id,
        formname:fname,
        label:null,
        formtype:null,
        required:null,
        answer:null
    })

    res.status(200).json({
        status:"ok",
        data:newform
    });

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error try again later"
        })
        // return next(new createError[501](["INTERNAL ERROR"]))
    }
    
}

exports.sendresponse=async (req,res,next)=>{
    try{
        const{url}=req.params;
        const arr=req.body;
        const {_id}=await Form.findOne({formurl:url})
          
        const addedResponse=await Response.findOneAndUpdate(
            {formid:_id},
            {$push:{
                'responses':{
                    $each:arr
                }
    
            }},
            {new:true,useFindAndModify: false}
            ) 
        res.status(200).json({
            status:"ok"
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error try again later"
        })
        // return next(new createError[501](["INTERNAL ERROR"]))
    }

}


exports.sendfile=async (req,res,next)=>{
    try{
        sampleFile = req.files.File;
        uploadPath = __dirname + '/uploadedfiles/' + sampleFile.name;
        sampleFile.mv(uploadPath, function(err) {
            if (err)
                res.status(500).json({err:err.message});
            res.status(200).json({name:sampleFile.name});
          });
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error try again later"
        })
        // return next(new createError[501](["INTERNAL ERROR"]))
    }
}

exports.removefile=async (req,res,next)=>{
    try{
        let filename = `${__dirname}/uploadedfiles/${req.body.File}`;
        fs.unlink(filename, (err) => {
        if (err) {
            res.status(400).json({
                message:"File does not exist or it's deleted already"
            })
        }
        console.log('File deleted successfully');
        res.status(200).json({
            deleted:"done"
        })
    });		
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error try again later"
        })
        // return next(new createError[501](["INTERNAL ERROR"]))
    }
}
