var createError = require('http-errors');
var fs = require('fs');
let Form=require('../models/formModel');
let Response=require('../models/responseModel');
let path=require('path')
exports.createform=async (req,res,next)=>{
    try{
    const {formname,formelements, formdetails}=req.body;
    const {user}=req;
    const newform=await Form.create({
        fname:formname,
        formelements,
        userid:user._id,
        data: formdetails
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
    const {formdetails}=req.body;
    try{
        const{url}=req.params;
        const arr=formdetails;
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
            status:"ok",
            addedResponse
        })
        console.log("added response: ",addedResponse)
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
        //uploadPath = __dirname + '/uploadedfiles/' + sampleFile.name;
        // uploadPath = __dirname + '/uploadedfiles/' + sampleFile.name;
        uploadPath=path.join(__dirname,"../uploadedfiles/",sampleFile.name);
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
        const {name}=req.params
        
        let uploadPath=path.join(__dirname,"../uploadedfiles/",name);
        fs.unlink(uploadPath, (err) => {
        if (err) {
            console.log(err)
            res.status(400).json({
                message:"File does not exist or it's deleted already"
            })
            return;
        }
        console.log('File deleted successfully');
        res.status(200).json({
            deleted:"done"
        })
        return
    });		
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error try again later"
        })
        // return next(new createError[501](["INTERNAL ERROR"]))
    }
}

exports.getform=async (req,res,next)=>{
    try{
        const{url}=req.params;
        const arr=req.body;
        const data=await Form.findOne({formurl:url});
        res.status(200).json({
            data
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal server error try again later"
        })
}
}
