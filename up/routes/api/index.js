var express = require('express')
var router = express.Router();
var mongoose = require('mongoose')
var models = require('../../models');

var sess;

router.post('/login',function(req,res,next){
	// curl --data "username=lukewegryn&password=asdf" http://127.0.0.1:3000/api/login
	if(req.body.username == "lukewegryn" && req.body.password == "asdf"){
		sess=req.session
		sess.email = "lukewegryn@gmail.com"
		sess.username = "lukewegryn@gmail.com"
		sess.auth = 1
		res.send("Login Successful")
	} else {
		res.send("Login failed")
	}
})

router.post('/newUser', function(req,res,next){
	var db = mongoose.connection;

	var user_username = req.body.username
	var user_password = "" //req.body.password

	//db.on('error', function(){res.send("Connection error")})
	var User = models.user
	var user = new User({ username: user_username, password: user_password, points:30})
	user.save(function (err, user){
		//if(err) res.send(JSON.stringify(err))
		sess=req.session
		sess.username = user_username
		sess.auth = 2
		res.send("New user created successfully.")
	})
})

router.get('/privileged/listUsers', function(req, res, next){
	var db = mongoose.connection;

	//db.on('error', function(){res.send("Connection error")})
	var User = models.user
	User.find(function(err, users){
		//if (err) res.send(JSON.stringify(err))
		res.send(JSON.stringify(users))
		//res.render('candidates', { candidates: candidates });
	})
})
/* GET users listing. */
router.post('/privileged/newCandidate', function(req, res, next) {
	// curl --data "name=Test" http://127.0.0.1:3000/api/newCandidate
	var db = mongoose.connection;

	var candidateName = req.body.name

	//db.on('error', function(){res.send("Connection error")})
	var Candidate = models.candidate
	var candidate = new Candidate({ name: candidateName, points:0})
	candidate.save(function (err, user){
		//if(err) res.send(JSON.stringify(err))
		res.send("{New candidate created successfully.}")
	})
})

router.get('/privileged/updateCandidate', function(req, res, next){
	res.send('Update Candidates')
})

router.get('/registered/listCandidates', function(req, res, next){
	var db = mongoose.connection;

	//db.on('error', function(){res.send("Connection error")})
	var Candidate = models.candidate
	Candidate.find(function(err, candidates){
		//if (err) res.send(JSON.stringify(err))
		res.send(JSON.stringify(candidates))
		//res.render('candidates', { candidates: candidates });
	})
})

module.exports = router;