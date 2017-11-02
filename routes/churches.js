var express = require('express');
var router = express.Router();
var Church = require("../models/church");
var Comment = require("../models/comment")

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

router.post("/churches",isLoggedIn, function(req, res){
    //get data from form and add to churches array
    var name = req.body.name;
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
    var newChurch = {name: name, image: image, founder: found, date: date, GOS:gos, NetWortht: net, population: pop, author:author}
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

router.get("/churches/new", isLoggedIn, function(req, res){
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
router.get("/churches/:id/edit", function(req, res){
    Church.findById(req.params.id, function(err, foundChurch){
        if(err){
            res.redirect("/churches")
        }else{
            res.render("churches/edit", {church: foundChurch});
        }
    })
})

//update church route

router.put("/churches/:id", function(req, res){
    Church.findByIdAndUpdate(req.params.id, req.body.church, function(err, updatedChurch){
        if(err){
            res.redirect("/churches")
        }else{
            res.redirect("/churches/" + req.params.id);
        }
    })
})

//Destroy Church Route

router.delete("/churches/:id/", function(req, res){
    Church.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/churches");
        }else{
            res.redirect("/churches");
        }
    })
})

// middle ware

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}



module.exports = router;