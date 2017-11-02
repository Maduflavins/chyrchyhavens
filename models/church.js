var mongoose = require('mongoose');



//Schema Setup
var churchSchema = new mongoose.Schema({
    name: String,
    image: String,
    founder: String,
    date: String,
    GOS: String,
    netWorth: String,
    population: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

var Church = mongoose.model("Church", churchSchema);

module.exports = Church;