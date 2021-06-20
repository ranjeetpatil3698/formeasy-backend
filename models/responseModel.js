
const mongoose=require('mongoose');


const responseSchema=new mongoose.Schema({
   formid:String,
   formname:String,
   responses:[
       {
        label:String,
        required:Boolean,
        formtype:String,
        answer:String 
       }
   ]
});



const Response=mongoose.model('Response',responseSchema);

module.exports=Response;