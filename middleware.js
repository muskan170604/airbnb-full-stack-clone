
const Listing=require("./models/listing");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const Review=require("./models/review");



module.exports.validateListing =((req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
        if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
});

module.exports.validateReview =(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
        if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
};


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirectUrl saved
        req.session.redirectUrl=req.originalUrl;//for post login page code
        req.flash("error","You must be logged in to create new listing!");
        return res.redirect("/login");
    }
    next();
};

//post login page

//login ke baad direct listings page pe nii jane ke liye or direct new listing create page pe jaane ke liye ye code likha gya h
//new list page ka jo url h usko save karwaye h oe user.js me require kiye or iske baad new route wale me saveRedirectUrl ko call kiye h 
//or direct new listing create wale page pe redirect kiye h
module.exports.saveRedirectUrl = (req,res,next)=>{
if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
}
next();
};

//iska implement isliye hus ki jo user post ko upload kiya h wahi bas uss page ko edit kar paye
module.exports.isOwner= async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","you don't have permission to do anything in this page!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

//ye code isliye likha gya h kyunki jo review likha h wahi user review ko delet kar payega koi aur nii
module.exports.isReviewAuthor= async(req,res,next)=>{
    let {id ,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","you don't have permission to do anything to this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};