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
			res.send({success: true})
			return
	} else{
		//db.on('error', function(){res.send("Connection error")})
		var db = mongoose.connection;
		var User = models.user
		User.find({ username: req.body.username, password: req.body.password},function(err, users){
			//if (err) res.send(JSON.stringify(err))
			if (users.length > 0) {
				sess=req.session
				sess.username = req.body.username
				sess.auth = 2
				res.send({success: true})
				return
			} else {
				res.send({success: false, message: "The username or password is incorrect."})
				return
			}
			//res.render('candidates', { candidates: candidates });
		})
	}
})

router.post('/newUser', function(req,res,next){
	var db = mongoose.connection;

	var user_username = req.body.username
	var user_password = "" //req.body.password

	if (!user_username){
		res.send(JSON.stringify({success:false, message: "The username must be at least one character."}))
		return
	}
	var User = models.user
	User.find({ username: req.body.username},function(err, users){
		//if (err) res.send(JSON.stringify(err))
		if (users.length > 0) {
			res.send({success: false, message: "That username is already in use."})
			return
		} else {
			var user = new User({ username: user_username, password: user_password, points:30})
			user.save(function (err, user){
				//if(err) res.send(JSON.stringify(err))
				sess=req.session
				sess.username = user_username
				sess.auth = 2
				res.send(JSON.stringify({success:true}))
				return
			})
		}
	})
})

router.get('/privileged/listUsers', function(req, res, next){
	var db = mongoose.connection;

	//db.on('error', function(){res.send("Connection error")})
	var User = models.user
	User.find(function(err, users){
		//if (err) res.send(JSON.stringify(err))
		users.success = true
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
		res.send(JSON.stringify({success:true}))
	})
})

router.get('/privileged/updateCandidate', function(req, res, next){
	res.send('Update Candidates')
})

router.post('/registered/upvote/', function(req, res, next){
	var Candidate = models.candidate
	Candidate.findOneAndUpdate({_id: req.body.id}, {$inc: {"points":1}}, function(err, candidates){
		//if (err) res.send(JSON.stringify(err))
		if (err) {
			res.send(JSON.stringify({success:false, message:err}))
			return
		} else {
			res.send(JSON.stringify({success: true, message: "Points added!", points: candidates.points}))
			return
		}
	})
})

router.get('/registered/listCandidates', function(req, res, next){
	var db = mongoose.connection;

	//db.on('error', function(){res.send("Connection error")})
	var Candidate = models.candidate
	Candidate.find(function(err, candidates){
		//if (err) res.send(JSON.stringify(err))
		candidates.success = true
		res.send(JSON.stringify(candidates))
		//res.render('candidates', { candidates: candidates });
	})
})

module.exports = router;