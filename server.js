const mongoose=require('mongoose');

const dotenv=require('dotenv');
dotenv.config({path:'./config.env'})
const app=require('./app');


console.log(process.env.NODE_ENV)

const DB=process.env.DATABASE_CLOUD;

mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
}).then(()=>console.log("DB connection Successfull"));

const port = process.env.PORT;

const server=app.listen(port,()=>{
    console.log(`listening to port ${port}`);
})

process.on('unhandledRejection',err=>{
    console.log(err.name,err.message,err);
    console.log('Unhandled Rejection ');
   
    server.close(()=>{
      process.exit(1);
    })
  });