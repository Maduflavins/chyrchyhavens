var express = require('express'),
app         = express(),
mongoose    = require('mongoose'),
Schema      = mongoose.Schema,
bodyParser  = require('body-parser');


mongoose.connect("mongodb://localhost/churchy");


//Schema Setup
var churchSchema = new mongoose.Schema({
    name: String,
    image: String,
    founder: String,
    date: String,
    GOS: String,
    netWorth: String,
    population: String
});

var Church = mongoose.model("Church", churchSchema);

// Church.create(
//     {
//        name:"church of today", 
//        image:"https://www.baragacounty.org/wp-content/uploads/2012/06/Bethany-Lutheran.jpg",
       
//        founder: "FOUNDER: harrison ford",
//        date: "Date: founded in 1949",
//        GOS:   "GOS: MacMilian",
//        netWorth: "NETWORTH: 2 billion dollars",
//        population: "Population: 3 thousand"
      
//     }, function(err, newChurch){
//         if(err){
//             console.log(err)
//         }else{
//             console.log("new church added");
//             console.log(newChurch);
//         }
//     })


app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
})

// var churches = [
//         {name:"church of saints", image:"https://www.baragacounty.org/wp-content/uploads/2012/06/Apostolic-Lutheran.jpg"},
//         {name:"church of today", image:"https://www.baragacounty.org/wp-content/uploads/2012/06/Bethany-Lutheran.jpg"},
//         {name:"redemers place", image:"https://www.baragacounty.org/wp-content/uploads/2012/06/Pelkie-Laestadian-Church.jpg"},
//         {name:"later day saints", image:"https://www.baragacounty.org/wp-content/uploads/2012/06/Pelkie-Laestadian-Church.jpg"}
//     ];

//INDEX ROUTE-SHOW ALL CHURCHES
app.get("/churches", function(req, res){
    
    //Retrive all Churches from the database
    Church.find({}, function(err, allChurches){
        if(err){
            console.log(err)
        }else{
            res.render("index", {churches: allChurches});

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

app.get("/churches/new", function(req, res){
    res.render("new.ejs");
})

//SHOW ROUTE MORE INFO ABOUT A CHURCH

app.get("/churches/:id/", function(req, res){
    //Find Campround with the provided ID
    Church.findById(req.params.id, function(err, foundChurch){
        if(err){
            console.log(err);
        }else{
            //Rener the show template for that church
            res.render("show", {church: foundChurch});

        }

    })
    
})

app.listen(3000, function(){
    console.log("churchu app is running on PORT 3000");
})