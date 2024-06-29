const Listing = require("../models/listing.js");

//index
module.exports.index= async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

//new
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

//show
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id)
    .populate(
        {path:"reviews",
            populate:{
                path:"author",
            },
        })
        .populate("owner");
        if(!listing){
        req.flash("error"," listing was deleted!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

//create
//use try and catch type method to handle any type of error
//jisme validatelisting likh diye usme koi if case se error handle karne ka jarurat nii padta

module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    try{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing");
    }
    const newListing=new Listing(req.body.listing);
    newListing.owner= req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New listing created!");
    res.redirect("/listings");
}
catch(err){
    next(err);
}
};

//edit
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error"," listing was deleted!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
    };

    //update

    module.exports.updateListing=async(req,res)=>{
        if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing");
        }
        let {id}=req.params;
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        req.flash("success","Listing Updated!");
        res.redirect(`/listings/${id}`);
        };

        //delete
        module.exports.destroyListing=async(req,res)=>{
            let {id}=req.params;
            let deletedListing =  await Listing.findByIdAndDelete(id);
            req.flash("success","listing deleted!");
            res.redirect("/listings");
            };