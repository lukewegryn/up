var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    points: Number
});

module.exports = mongoose.model('User',userSchema)