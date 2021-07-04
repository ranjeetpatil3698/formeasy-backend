const express=require('express');
const morgan=require('morgan');
const cors=require('cors')
const cookieParser=require('cookie-parser')
const fileUpload = require('express-fileupload');
const app=express();

const {signup,login,oneuser,protect,checkuser,logout}=require('./controllers/Authcontroller');
const {createform,sendresponse,sendfile,removefile,getform,getfile}=require('./controllers/Formcontroller')
const {getAllFormsOfUser,getAllResponsesOfForm}=require('./controllers/Usercontroller');

if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

app.use(cors({
    origin:'http://127.0.0.1:3000',
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload())
app.post("/checkuser",checkuser)
app.post("/signup",signup)
app.post("/login",login)
app.post("/sendresponse/:url",sendresponse)
app.get("/getform/:url",getform)

app.post("/sendfile",sendfile)
app.get("/removefile/:name",removefile)
app.use(protect)
app.get("/getuser",oneuser)
app.post("/createform",createform)
app.get("/getallforms",getAllFormsOfUser)
app.get("/getAllResponses/:url",getAllResponsesOfForm)
app.get("/logout",logout)
app.get("/viewfile/:filename",getfile)

module.exports=app;
