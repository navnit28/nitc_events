const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
// const config=require('./config/database');
const static_path=path.join(__dirname,'public');
console.log(static_path);
app.use(bodyParser.urlencoded({ extended: false }));
// app.set('view engine','ejs');
app.use(express.static(static_path));
app.set('view engine','ejs');
app.get('/',(req,res)=>{
    res.render('index');
})
app.get('/adminlogin',(req,res)=>{
    res.render('adminlogin');
})
app.post('/adminlogin',(req,res)=>{
    // res.render('adminlogin');
    console.log("admin login");
    console.log(req.body);
    const {email,password}=req.body;
    if(email=="admin" && password=="admin"){
        //use passport to authenticate
        res.redirect('/aevents');
    }
    else{
        res.send("invalid credentials");
        //delay of 2 seconds
        res.redirect('/adminlogin');
    }
})
app.get('/aevents',(req,res)=>{
    res.render('aevents');
})
app.get('/events',(req,res)=>{
    res.render('events');
})
app.get('/addevents',(req,res)=>{
    res.render('addevents');
})
app.get('/addevent',(req,res)=>{
    res.render('addevent');
})
mongoose.connect('mongodb://localhost:27017/nitc_events',{useNewUrlParser:true,useUnifiedTopology:true});
app.listen(3000,()=>{
    console.log('server started');
});
