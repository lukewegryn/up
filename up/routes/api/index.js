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
/* GET users listing. */
router.post('/newCandidate', function(req, res, next) {
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

router.get('/updateCandidate', function(req, res, next){
	res.send('Update Candidates')
})

router.get('/privileged/listCandidates', function(req, res, next){
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