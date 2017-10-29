var mongoose = require('mongoose');
var Church = require("./models/church");
var Comment = require("./models/comment");


var data = [
    {
        name: "church of havens",
        image: "https://www.baragacounty.org/wp-content/uploads/2012/06/LAnse-United-Methodist-Church.jpg",
        founder: "Founder: james Bright",
        date:    "founded: 1445",
        GOS:     "GOS: Harry Porter",
        net:     "NetWorth 23 billion dollars",
        population: "Population: Population is about three thousand people"
    },
    {
        name: "church of overcormrs",
        image: "https://www.baragacounty.org/wp-content/uploads/2012/06/LAnse-United-Methodist-Church.jpg",
        founder: "Founder: james Bright",
        date:    "founded: 1445",
        GOS:     "GOS: Harry Porter",
        net:     "NetWorth 23 billion dollars",
        population: "Population: Population is about three thousand people"
    },

    {
        name: "church of havens chritainty everlsating",
        image: "https://www.baragacounty.org/wp-content/uploads/2012/06/LAnse-United-Methodist-Church.jpg",
        founder: "Founder: james Bright",
        date:    "founded: 1445",
        GOS:     "GOS: Harry Porter",
        net:     "NetWorth 23 billion dollars",
        population: "Population: Population is about three thousand people"
    }
]



function seedDB(){
        //REMOVED CHURCHES

        Church.remove({}, function(err){
            if(err){
                console.log(err);
            }else{
                console.log("churches removed");
            }
            //ADD A FEW CHURCH
            data.forEach(function(seed){
                Church.create(seed, function(err, church){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("new Church added");

                        //Create Comments
                        Comment.create(
                            {
                                text: "this church used to be great", 
                                author:"hammer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err)
                                }else{
                                    church.comments.push(comment);
                                    church.save();
                                    console.log("creatd new comment");
                                }

                        })
                    }
                })

            })
        
        })

        

        //ADD COMMENTS AS WELL

}

module.exports = seedDB;