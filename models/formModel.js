
const mongoose=require('mongoose');
const { v4: uuidv4 } = require('uuid');



const formSchema=new mongoose.Schema({
    fname:{
        type:String,
        required:[true,"provide form name"]
    },
    userid:{
        type:String,
        required:[true]
    },
    formelements:Number,
    data:[
        {
            id:Number,
            label:String,
            required:Boolean,
            formtype:String,
        }
    ],
    totalresponses:{
        type:Number,
        default:0
    },
    totalviews:{
        type:Number,
        default:0
    },
    formurl:String
});


formSchema.pre('save',async function(next){
this.formurl=uuidv4(); 
next();
});

const Form=mongoose.model('Form',formSchema);

module.exports=Form;