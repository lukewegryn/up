var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    name: String,
    points: Number
});

module.exports = mongoose.model('Candidate',userSchema)