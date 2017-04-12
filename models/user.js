var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    points: Number,
    privilege: Number
});

module.exports = mongoose.model('User',userSchema)