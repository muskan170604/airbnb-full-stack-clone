const User=require("../models/user.js");


//signup
module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUp=async(req,res)=>{
    try{
        let { username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser = await User.register(newUser,password);
        //log in after signUp
req.login(registeredUser,(err)=>{
    if(err){
        return next(err);
    }
    req.flash("success","Welcome to wanderlust");
        res.redirect("/listings");
});
}
catch(err){
    req.flash("error",err.message);
res.redirect("/signup");
}
};

//login
module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.logIn=async(req,res)=>{
    //res.send("your are logged in!");
    req.flash("success","Welcome back to wanderlust ,you are logged in!");
    //niche wala line ka mtlv h jab direct listing page se logi karenge to listing page pe aa jaye nii to agar
    //create new list/ya edit list se direct karenge to usi page pe dobara aa jaye
    //kaam aise karta h jaise redirecturl ko check karega save h ya nii nii rahega to listin page pe land karenge nii toh koi edit or create page pe
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

//logout
module.exports.logOut=(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
    req.flash("success","logged you out successfully!");
    res.redirect("/listings");
    });
};