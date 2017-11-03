var Church = require("../models/church");
var Comment= require("../models/comment")
var middlewareObj = {};

middlewareObj.checkChurchOwnership = function(req, res, next){

    if(req.isAuthenticated()){
        Church.findById(req.params.id, function(err, foundChurch){
            if(err){
                res.redirect("back");
            }else{
                //does user own campground
                if(foundChurch.author.id.equals(req.user._id)){
                    next();

                }else{
                    res.redirect("back");
                }
                
                
            }
        });

    }else{
        res.redirect("back");
    }
        
    
}

middlewareObj.checkCommentOwnerShip = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                //does user own campground
                if(foundComment.author.id.equals(req.user._id)){
                    next();

                }else{
                    res.redirect("back");
                }
                
                
            }
        });

    }else{
        res.redirect("back");
    }
            
    
}

middlewareObj.isLoggedIn = function(req, res, next){

    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
    
}


module.exports = middlewareObj;