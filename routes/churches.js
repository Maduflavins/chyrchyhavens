var express = require('express');
var router = express.Router();
var Church = require("../models/church");
var Comment = require("../models/comment")
var middleware = require("../middleware/index.js");

//INDEX ROUTE-SHOW ALL CHURCHES
router.get("/churches", function(req, res){
    
    
    //Retrive all Churches from the database
    Church.find({}, function(err, allChurches){
        if(err){
            console.log(err)
        }else{
            res.render("churches/index", {churches: allChurches});

        }
    })
    

    

});

//CREATE ROUTE ADD NEW CHURCHES TO DATABASE

router.post("/churches",middleware.isLoggedIn, function(req, res){
    //get data from form and add to churches array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var found = req.body.founder;
    var date =  req.body.date;
    var gos   = req.body.GOS;
    var net  =  req.body.NetWorth;
    var pop =   req.body.population;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newChurch = {name: name, price: price, image: image, founder: found, date: date, GOS:gos, NetWortht: net, population: pop, author:author}
    //Create a new Church and add to database
    Church.create(newChurch, function(err, newlyAddedChurch){
        if(err){
            console.log(err)
        }else{
            //Redirect back to churches page

            res.redirect("/churches");

        }
    })

    
})



//NEW- SHOW TO CREATE NEW CHURCHE

router.get("/churches/new", middleware.isLoggedIn, function(req, res){
    res.render("churches/new");
})


//SHOW ROUTE MORE INFO ABOUT A CHURCH

router.get("/churches/:id/", function(req, res){
    //Find Church with the provided ID
    Church.findById(req.params.id).populate("comments").exec(function(err, foundChurch){
        if(err){
            console.log(err);
        }else{
            console.log(foundChurch);
            //Rener the show template for that church
            res.render("churches/show", {church: foundChurch});

        }

    })
    
})

//EDIT CHURCH 
router.get("/churches/:id/edit",middleware.checkChurchOwnership,function(req, res){
	//is user logged in
		Church.findById(req.params.id, function(err, foundChurch){
                req.flash("success", "you are about to edit a church")
				res.render("church/edit", {church: foundChurch});
		});

});

//update church route

router.put("/churches/:id",middleware.checkChurchOwnership, function(req, res){
    Church.findByIdAndUpdate(req.params.id, req.body.church, function(err, updatedChurch){
        if(err){
            req.flash("error", "not able to update")
            res.redirect("/churches")
        }else{
            req.flash("success", "you have successfully updates a church")
            res.redirect("/churches/" + req.params.id);
        }
    })
})

//Destroy Church Route

router.delete("/churches/:id/",middleware.checkChurchOwnership, function(req, res){
    Church.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/churches");
        }else{
            res.redirect("/churches");
        }
    })
})


module.exports = router;