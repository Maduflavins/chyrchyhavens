var express  = require('express'),
app          = express(),
mongoose     = require('mongoose'),
Church       = require("./models/church"),
Comment      = require("./models/comment"),
User          = require('./models/user'),
methodOveride = require("method-override"),
flash         = require("connect-flash");
Schema       = mongoose.Schema,
passport      = require("passport"),
passportLocalMongoose = require('passport-local-mongoose'),
LocalStrategy = require('passport-local'),
seedDB      = require("./seeds");
bodyParser  = require('body-parser');


// REQUIRING ROUTES

var churchRoutes = require("./routes/churches"),
commentRoutes    = require("./routes/comments"),
indexRoutes      = require("./routes/index");



mongoose.Promise = require('bluebird');

mongoose.connect("mongodb://localhost/churchy");

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.use(methodOveride("_method"));
app.use(flash());



//  seedDB(); 

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
	res.locals.error= req.flash("error");
	res.locals.success= req.flash("success");
	next();
})

app.use(indexRoutes);
app.use(commentRoutes);
app.use(churchRoutes);

//=================================





app.listen(3000, function(){
    console.log("churchu app is running on PORT 3000");
})