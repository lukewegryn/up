var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    name: String,
    points: Number,
    description: String,
    nominatedBy: String,
});

module.exports = mongoose.model('Candidate',userSchema)