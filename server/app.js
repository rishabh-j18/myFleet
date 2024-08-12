const express=require('express');
const dotenv=require("dotenv");
const cors=require('cors');
dotenv.config({path:'./config.env'});
require('./db/db')
const PORT=process.env.PORT;

const User=require('./model/userschema');
const cookieParser = require('cookie-parser');

const app=express();

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.options('*', cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json()); // parse the body in json without using body parser
app.use(require('./router/auth'));





app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`);
});