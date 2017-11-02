var express = require("express");
var router = express.Router();
var Church = require("../models/church");
var Comment = require("../models/comment");



//===================================================
//COMMENT NEW
//====================================================

router.get("/churches/:id/comments/new", isLoggedIn, function(req, res){
    
    Church.findById(req.params.id, function(err, church){
        if(err){
            console.log(err)
        }else{
            res.render("comments/new", {church: church});
        }
    })
    
})
//===================================================================
// COMMENT CREATE
//====================================================================
router.post("/churches/:id/comments",isLoggedIn, function(req, res){
    //LOOKUP COMMENTS USNG IDS
    Church.findById(req.params.id, function(err, church){
        if(err){
            console.log(err);
            res.redirect("/churches")
        }else{
            //CREATE A COMMENT
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                }else{
                    //add a user and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    //CONNECT COMMENT TO A CHURCH
                    church.comments.push(comment);
                    //save
                    church.save();
                    //REDIRECT TO THE CHURCH SHOW PAGE
                    console.log(comment);
                    res.redirect("/churches/" + church._id)
                }
            })
            
            

        }
    })
    
})
//======================================================================
//MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

//======================================================================





module.exports = router;