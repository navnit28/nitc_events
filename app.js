const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const bodyParser = require('body-parser');
//require dotenv
require('dotenv').config();
require('./auth')
const passport = require('passport');
const sesssion = require('express-session');
const Event=require('./models/eventSchema');
const Registration=require('./models/registrationSchema');
// const config=require('./config/database');
const static_path=path.join(__dirname,'public');
console.log(static_path);
const {
    PORT =3000,
    NODE_ENV='development',
    SESS_NAME='sid',
    SES_LIFE=1000*60*60*2,
    SESSION_SECRET='secret'
} =process.env
const IN_PROD=NODE_ENV==='production'
app.use(bodyParser.urlencoded({ extended: false }));
app.use(sesssion({
    name:SESS_NAME,
    resave:false,
    saveUninitialized:false,
    secret:SESSION_SECRET,
    cookie: { 
        maxAge:  SES_LIFE,
        sameSite: true,
        secure: IN_PROD

    },
}))
app.use(passport.initialize());
app.use(passport.session());
// app.set('view engine','ejs');
app.use(express.static(static_path));
app.set('view engine','ejs');
const redirectLoginAdmin=(req,res,next)=>{
    if(!req.session.userId){
        res.redirect('/adminlogin')
    }else{
        next()
    }
}
const redirectHomeAdmin=(req,res,next)=>{
    if(req.session.userId){
        res.redirect('/aevents')
    }else{
        next()
    }
}
function isLoggedIn(req, res, next) {
    req.user ? next() : res.redirect('/');
  }
app.get('/',(req,res)=>{
    res.render('index');
})
app.get('/adminlogin',redirectHomeAdmin,(req,res)=>{
    res.render('adminlogin');
})
app.post('/adminlogin',(req,res)=>{
    // res.render('adminlogin');
    console.log("admin login");
    console.log(req.body);
    const {email,password}=req.body;
    if(email=="admin" && password=="admin"){
        //use passport to authenticate
        req.session.userId=email;
        res.redirect('/aevents');
    }
    else{
        res.send("invalid credentials");
        //delay of 2 seconds
        res.redirect('/adminlogin');
    }
})
app.get('/aevents',redirectLoginAdmin,async (req,res)=>{
    const events=await Event.find();
    console.log(events);
    res.render('aevents',{events});
})
app.get('/events',isLoggedIn,async (req,res)=>{
    const events=await Event.find();
    const registrations=await Registration.find({user_email:req.user.email});
    console.log(registrations);
    // console.log(req.user);
    for(let i=0;i<events.length;i++){
        let found=false;
        for(let j=0;j<registrations.length;j++){
            if(events[i]._id==registrations[j].event_id){
                events[i].registered=true;
                found=true;
            }
        }
        if(!found){
            events[i].registered=false;
        }
    }
    res.render('events',{events,user:req.user});
})
app.get('/register/event/:id',isLoggedIn,async (req,res)=>{
    const id=req.params.id;
    const user_email=req.user.email;
    console.log(user_email,id);
    const registration=new Registration({
        event_id:id,
        user_email:user_email
    });
    registration.save();
    res.send("registered");
})
app.get('/addevent',redirectLoginAdmin,(req,res)=>{
    res.render('addevent');
})
app.get('/auth/google',passport.authenticate('google',{
    scope:['profile','email']
}))
app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/events',
    failureRedirect: '/'
  })
);
app.post('/addevent',redirectLoginAdmin,async (req,res)=>{
    const {
        title,
        description,
        date,
        time,
        url,
        venue,
        host
    }=req.body;
    const admin_id='123';
    try{
        const newEvent=new Event({
            title,
            description,
            date,
            time,
            url,
            venue,
            host,
            admin_id
        });
        await newEvent.save()
        res.send('Event added');
    }
    catch(err){
        console.log(err);
        res.send("error");
    }
// }console.log(title,description,date,time,url,venue,host);
    
})
app.get('/editevent',redirectLoginAdmin,async (req,res)=>{
    const event=await Event.findById(req.query.id);
    console.log(event);
    res.render('editevent',{event});
})
app.post('/editevent',redirectLoginAdmin,async(req,res)=>{
    const {
        title,
        description,
        date,
        time,
        url,
        venue,
        host
    }=req.body;
    // const admin_id='123';
    console.log(title,description,date,time,url,venue,host);
    const id=req.query.id;
    try{
        //find by id and update
        const event=await Event.findById(id);
        event.title=title;
        event.description=description;
        event.date=date;
        event.time=time;
        event.url=url;
        event.venue=venue;
        event.host=host;
        await event.save();
        res.send('Event updated');
    }
    catch(err){
        console.log(err);
        res.send("error");
    }
})
app.get('/deleteevent/:id',redirectLoginAdmin,async(req,res)=>{
    const id=req.params.id;
    try{
        const event=await Event.findById(id);
        await event.remove();
        res.redirect('/aevents');
    }
    catch(err){
        console.log(err);
        res.send("error");
    }
})
app.get('/admin/logout',redirectLoginAdmin,(req,res)=>{
    req.session.destroy(err=>{
        if(err){
            return res.redirect('/aevents');
        }
        res.clearCookie(SESS_NAME);
        console.log("logged out");
        res.redirect('/adminlogin');
    })
})
app.get('/user/logout',isLoggedIn,async(req,res)=>{
    req.logOut(function(err){
        if(err){
            return res.redirect('/events');
        }
        req.session.destroy();
        console.log("logged out");
        res.redirect('/');
    })
})
mongoose.connect('mongodb://localhost:27017/nitc_events',{useNewUrlParser:true,useUnifiedTopology:true});
app.listen(PORT,()=>{
    console.log(`server started ${PORT}`);
});
