const express = require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const {isLoggedIn, isOwner,validateListing,}=require("../middleware.js");
const listingController=require("../controllers/listing.js");

const multer =require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });
//var multer  = require('multer');
//const upload = multer({ dest: 'upload/'});

router.route("/")
.get( wrapAsync(listingController.index))
.post( isLoggedIn, upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));

//new route
router.route("/new")
.get(isLoggedIn,listingController.renderNewForm);


router.route("/:id")
.get( wrapAsync (listingController.showListing))
.put(isLoggedIn, isOwner,wrapAsync (listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync (listingController.destroyListing));

//edit route
router.route("/:id/edit")
.get(isLoggedIn,isOwner,wrapAsync (listingController.renderEditForm));


module.exports=router;
