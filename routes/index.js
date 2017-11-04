var express  = require('express');
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user")


//INDEX ROUTE
router.get("/", function(req, res){
    res.render("landing");
})




/


//SHOW REGISTER FORM

router.get("/register", function(req, res){
    res.render("register");
})

//HANDLE THE SIGNUP AUTHENTICATION

router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error",err.message);
			return res.render("register")
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "welcome to churchy"  +  user.username);
			res.redirect("/churches");
		})
	})
});

//show login form
router.get("/login", function(req, res){

	res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/churches",
		failureRedirect: "/login"

	}), function(req, res){
	
});

//Logout Logic

router.get("/logout", function(req, res){
    req.logout();
	res.redirect("/churches");
	req.flash("success", "you are logged out");
})


module.exports = router;