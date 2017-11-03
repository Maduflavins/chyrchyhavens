var express = require("express");
var router = express.Router({mergeParams: true});
var Church = require("../models/church");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");



//===================================================
//COMMENT NEW
//====================================================

router.get("/churches/:id/comments/new", middleware.isLoggedIn, function(req, res){
    
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
router.post("/churches/:id/comments", middleware.isLoggedIn, function(req, res){
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

//EDIT COMMENT ROUTE
router.get("/churches/:id/comments/:comment_id/edit", middleware.checkCommentOwnerShip, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back")
        }else{
            res.render(comments/edit, {church_id:req.params.id});
        }
    })
   
})

//UPDATE COMMENT ROUTE

router.put("/churches/:id/comments/:comment_id", middleware.checkCommentOwnerShip, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/churches/" + req.params.id);
        }
    })
})

//DELETE COMMENT ROUTE

router.delete("/churches/:id/comments/:comment_id", middleware.checkCommentOwnerShip, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back")
        }else{
            res.redirect("/church/" + req.params.id)
        }
    })
})


module.exports = router;