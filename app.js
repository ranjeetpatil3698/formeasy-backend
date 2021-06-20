const express=require('express');
const morgan=require('morgan');
const cookieParser=require('cookie-parser')
const fileUpload = require('express-fileupload');
const app=express();

const {signup,login,oneuser,protect}=require('./controllers/Authcontroller');
const {createform,sendresponse,sendfile,removefile}=require('./controllers/Formcontroller')
const {getAllFormsOfUser,getAllResponsesOfForm}=require('./controllers/Usercontroller');

if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}


app.use(express.json());
app.use(cookieParser());
app.use(fileUpload())

app.post("/signup",signup)
app.post("/login",login)
app.post("/sendresponse/:url",sendresponse)
app.post("/sendfile",sendfile)
app.get("/removefile",removefile)
app.use(protect)
app.get("/getuser",oneuser)
app.post("/createform",createform)
app.get("/getallforms",getAllFormsOfUser)
app.get("/getAllResponses/:id",getAllResponsesOfForm)

module.exports=app;
