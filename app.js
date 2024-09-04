if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

//console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


//for routes folder
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

//const { deserialize } = require("v8");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

const dbURL = process.env.ATLASDB_URL;


const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
    expires:Date.now()+ 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
    },
};

/*app.get("/", (req, res) => {
    res.send("Hi, I am root");
});*/



//imp : iske niche jo routes use kiye h hamesha usse pahle ye functions likhna hoga

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();//next call karna nii bhulna nii toh upar wala line me hi stuck hoke rah jayenge
});

/*app.get("/demouser",async(req,res)=>{
let fakeUser  = new User({
    email:"delta@gmail.com",
    username:"delta",
});

    let registeredUser = await User.register(fakeUser,"helloworld");
    res.send(registeredUser);
});*/

//for /routes/listing.js this line is used
app.use("/listings",listingRouter);
//for /routes/reviews.js this line is used
app.use("/listings/:id/reviews",reviewRouter);
//for /routes/user.js this line is used
app.use("/",userRouter);



//const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
await mongoose.connect(dbURL);
}



        //agar user galtii se kisi or link me get message pass kar diya toh wo page not found ka error show kara dega.
        //example me /localhost:8080/randam

        app.all("*",(req,res,next)=>{
            next(new ExpressError(404,"Page not found"));
        });
    
    app.use((err,req,res,next)=>{
        let{status=500, message="Something went wrong!"}=err;
        //res.status(status).render("listings/error.ejs",{message});
        res.status(status).send(message);
    });

    app.listen(8080, () => {
    console.log("server is listening to port 8080");
    });