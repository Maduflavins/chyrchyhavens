var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser({urlenconded: true}));

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
})

var churches = [
        {name:"church of saints", image:"https://www.baragacounty.org/wp-content/uploads/2012/06/Apostolic-Lutheran.jpg"},
        {name:"church of today", image:"https://www.baragacounty.org/wp-content/uploads/2012/06/Bethany-Lutheran.jpg"},
        {name:"redemers place", image:"https://www.baragacounty.org/wp-content/uploads/2012/06/Pelkie-Laestadian-Church.jpg"},
        {name:"later day saints", image:"https://www.baragacounty.org/wp-content/uploads/2012/06/Pelkie-Laestadian-Church.jpg"}
    ];

app.get("/churches", function(req, res){
    

    res.render("churches", {churches:churches});

});

app.post("/churches", function(req, res){
    //get data from form and add to churches array
    var name = req.body.name;
    var image = req.body.image;
    var newChurch = {name: name, image: image}
    churches.push(newChurch);

    //Redirect back to churches page

    res.redirect("/churches");
})

app.get("/churches/new", function(req, res){
    res.render("new.ejs");
})


app.listen(3000, function(){
    console.log("churchu app is running on PORT 3000");
})