var express  = require('express'),
app          = express(),
mongoose     = require('mongoose'),
Church       = require("./models/church"),
Comment      = require("./models/comment"),
User          = require('./models/user'),
Schema       = mongoose.Schema,
passport      = require("passport"),
passportLocalMongoose = require('passport-local-mongoose'),
LocalStrategy = require('passport-local'),
seedDB      = require("./seeds");
bodyParser  = require('body-parser');


mongoose.Promise = require('bluebird');

mongoose.connect("mongodb://localhost/churchy");

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"))



seedDB();

//PASSPORT CONFIGURATION

//passport configuration

app.use(require("express-session")({
	secret: "this is building something",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
})


//=================================





app.get("/", function(req, res){
    res.render("landing");
})



//INDEX ROUTE-SHOW ALL CHURCHES
app.get("/churches", function(req, res){
    
    
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

app.post("/churches", function(req, res){
    //get data from form and add to churches array
    var name = req.body.name;
    var image = req.body.image;
    var found = req.body.founder;
    var date =  req.body.date;
    var gos   = req.body.GOS;
    var net  =  req.body.NetWorth;
    var pop =   req.body.population;
    var newChurch = {name: name, image: image, founder: found, date: date, GOS:gos, NetWortht: net, population: pop}
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

app.get("churches/new", function(req, res){
    res.render("/churches/new");
})

//SHOW ROUTE MORE INFO ABOUT A CHURCH

app.get("/churches/:id/", function(req, res){
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


//===================================================
//COMMENT ROUTE
//====================================================

app.get("/churches/:id/comments/new", isLoggedIn, function(req, res){
    //find Church by ID
    Church.findById(req.params.id, function(err, church){
        if(err){
            console.log(err)
        }else{
            res.render("comments/new", {church: church});
        }
    })
    
})

app.post("/churches/:id/comments",isLoggedIn, function(req, res){
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
                    //CONNECT COMMENT TO A CHURCH
                    church.comments.push(comment);
                    //save
                    church.save();
                    //REDIRECT TO THE CHURCH SHOW PAGE
                    res.redirect("/churches/" + church._id)
                }
            })
            
            

        }
    })
    
})



//AUTHENTICATION ROUTES
//==========================

//SHOW REGISTER FORM

app.get("/register", function(req, res){
    res.render("register");
})

//HANDLE THE SIGNUP AUTHENTICATION

app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register")
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/churches");
		})
	})
});

//show login form
app.get("/login", function(req, res){
	res.render("login");
});

//handling login logic
app.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/churches",
		failureRedirect: "/login"

	}), function(req, res){
	
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

//Logout Logic

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/churches");
})

app.listen(3000, function(){
    console.log("churchu app is running on PORT 3000");
})