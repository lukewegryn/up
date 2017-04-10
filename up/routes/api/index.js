var express = require('express')
var router = express.Router();
var mongoose = require('mongoose')
var models = require('../../models');


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

router.get('/listCandidates', function(req, res, next){
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