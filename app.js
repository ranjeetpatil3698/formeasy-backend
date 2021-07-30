const express=require('express');
const morgan=require('morgan');
const cors=require('cors')
const cookieParser=require('cookie-parser')
const fileUpload = require('express-fileupload');
const rateLimit=require('express-rate-limit');
const helmet=require('helmet');
const mongoSantize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const compression=require('compression');
const app=express();

const {signup,login,oneuser,protect,checkuser,logout}=require('./controllers/Authcontroller');
const {createform,sendresponse,sendfile,removefile,getform,getfile,deleteform,changestatus}=require('./controllers/Formcontroller')
const {getAllFormsOfUser,getAllResponsesOfForm}=require('./controllers/Usercontroller');

if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

app.use(cors({
    origin:process.env.REACT_APP_URL,
    credentials:true
}))

app.enable('trust proxy');

//to add neccessary headers
app.use(helmet());


//to avoid to many request from one ip
const limiter=rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:'too many requests from this ip,please try again in an hour'
  })

app.use('/',limiter)


//provide XSS NOSQL protection 
app.use(mongoSantize());

app.use(xss());

//to compress request
app.use(compression());

app.get("/status",(req,res)=>{
    res.status(200).json({
        Message:"api is up"
    })
})


app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.post("/checkuser",checkuser)
app.post("/signup",signup)
app.post("/login",login)
app.post("/sendresponse/:url",sendresponse)
app.get("/getform/:url",getform)
app.get("/viewfile/:filename",getfile)

app.post("/sendfile",sendfile)
app.get("/removefile/:name",removefile)
app.use(protect)
app.get("/getuser",oneuser)
app.post("/createform",createform)
app.get("/getallforms",getAllFormsOfUser)
app.get("/getAllResponses/:url",getAllResponsesOfForm)
app.get("/logout",logout)

app.patch("/deleteform/:id",deleteform)
app.patch("/changestatus/:url",changestatus)

app.all('*',(req,res)=>{
res.status(404).json({
  status:'fail',
  messsage:`Route ${req.originalUrl} does not exist on this server`
});
})

module.exports=app;
