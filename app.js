const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const Event=require('./models/eventSchema');
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
app.get('/aevents',async (req,res)=>{
    const events=await Event.find();
    console.log(events);
    res.render('aevents',{events});
})
app.get('/events',async (req,res)=>{
    const events=await Event.find();
    console.log(events);
    res.render('events',{events});
})
app.get('/addevent',(req,res)=>{
    res.render('addevent');
})
app.post('/addevent',async (req,res)=>{
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
app.get('/editevent',async (req,res)=>{
    const event=await Event.findById(req.query.id);
    console.log(event);
    res.render('editevent',{event});
})
app.post('/editevent',async(req,res)=>{
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
app.get('/deleteevent/:id',async(req,res)=>{
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
mongoose.connect('mongodb://localhost:27017/nitc_events',{useNewUrlParser:true,useUnifiedTopology:true});
app.listen(3000,()=>{
    console.log('server started');
});
