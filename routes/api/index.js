var express = require('express')
var router = express.Router();
var mongoose = require('mongoose')
var models = require('../../models');

var sess
var Pusher = require('pusher')
var pusher = new Pusher({
  appId: '327047',
  key: 'ba3b3cba4d81f78b5a20',
  secret: '601da58ca7dbfa351a96',
  encrypted: true
});


router.post('/login',function(req,res,next){
	// curl --data "username=lukewegryn&password=asdf" http://127.0.0.1:3000/api/login
		//db.on('error', function(){res.send("Connection error")})
	var db = mongoose.connection;
	var User = models.user
	User.findOne({ username: req.body.username, password: req.body.password},function(err, user){
		//if (err) res.send(JSON.stringify(err))
		if (user) {
			sess=req.session
			sess.username = req.body.username
			sess.user_id = user._id
			console.log(user)
			console.log(user.privilege)
			sess.auth = user.privilege
			res.send({success: true, privilege: user.privilege})
			return
		} else {
			res.send({success: false, message: "The username or password is incorrect."})
			return
		}
		//res.render('candidates', { candidates: candidates });
	})
})

router.get('/registered/logout', function(req,res,next){
	req.session.destroy();
	res.send({success: true, message: "Logged out successfully."})
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
			var user = new User({ username: user_username, password: user_password, points:30, privilege:2})
			user.save(function (err, user){
				//if(err) res.send(JSON.stringify(err))
				sess=req.session
				sess.username = user_username
				sess.auth = 2
				res.send(JSON.stringify({success:true, privilege:2}))
				return
			})
		}
	})
})

router.get('/currentPrivilege', function(req, res, next){
	sess=req.session
	if (sess.auth){
		res.send(JSON.stringify({success:true, username:sess.username, privilege:sess.auth}))
	} else {
		res.send(JSON.stringify({success:true, privilege:0}))
	}
})

router.get('/registered/pointsRemaining', function(req, res, next){
	var User = models.user
	sess=req.session
	User.findOne({_id: sess.user_id}, function(err,user){
		if(err){
			res.send(JSON.stringify({success:false,message:err}))
		} else {
			res.send(JSON.stringify({success:true, points:user.points}))
		}
	})
})

router.post('/registered/upvote/', function(req, res, next){
	var User = models.user
	sess=req.session
	User.findOne({_id: sess.user_id}, function(err,user){
		if (user.points <= 0){
			res.send(JSON.stringify({success:false,message:"You are out of points!"}))
			return
		} else {
			User.findOneAndUpdate({_id: sess.user_id}, {$inc: {"points":-1}}, function(err2, users){
				if (err) {
					res.send(JSON.stringify({success:false, message:err2}))
					return
				} else{
					var Candidate = models.candidate
					Candidate.findOneAndUpdate({_id: req.body.id}, {$inc: {"points":1}}, function(err, candidate){
						//if (err) res.send(JSON.stringify(err))
						if (err) {
							res.send(JSON.stringify({success:false, message:err}))
							return
						} else {
							User.findOneAndUpdate({_id: candidate.nominatedBy}, {$inc: {"points":1}}, function(err2, users){
								if (err) {
									res.send(JSON.stringify({success:false, message:"Could not give nominatedBy user points."}))
									return
								} else{
									pusher.trigger('vote-channel', 'vote-up-event', {
										  "message": "update"
										});
									res.send(JSON.stringify({success: true, message: "Points added!", points: candidate.points}))
									return
								}
							})
						}
					})
				}
			})
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
router.post('/registered/newCandidate', function(req, res, next) {
	// curl --data "name=Test" http://127.0.0.1:3000/api/newCandidate
	var db = mongoose.connection;

	var candidate_name = req.body.candidate_name
	var candidate_description = req.body.candidate_description
	sess=req.session

	//db.on('error', function(){res.send("Connection error")})
	var Candidate = models.candidate
	var candidate = new Candidate({ name: candidate_name, description: candidate_description, points:0, nominatedBy: sess.user_id})
	candidate.save(function (err, user){
		if(err) {
			res.send(JSON.stringify({success:false, message:"Unable to create a candidate."}))
			return
		}
		res.send(JSON.stringify({success:true, message:"" + candidate_name + " created sucessfully!"}))
	})
})

router.post('/registered/candidate', function(req, res, next) {
	var db = mongoose.connection;

	var candidate_id = req.body.candidate_id
	var Candidate = models.candidate
	Candidate.findOne({_id: candidate_id},function(err, candidate){
		if(err) {
			res.send(JSON.stringify({success:false, message:"Unable to get that candidate."}))
			return
		}
		res.send(JSON.stringify({success: true, candidate: candidate}))
	})
})

router.post('/privileged/deleteCandidate', function(req, res, next) {
	var db = mongoose.connection;

	var candidate_id = req.body.id
	console.log(candidate_id)
	var Candidate = models.candidate
	Candidate.findOneAndRemove({ _id: candidate_id },function(err, candidate){
		if(err) {
			res.send(JSON.stringify({success:false, message:"Unable to delete that candidate."}))
			return
		} else {
			pusher.trigger('vote-channel', 'vote-delete-event', {
								  "message": "delete"
								});
			res.send(JSON.stringify({success: true, candidate: candidate}))
		}
	})
})

router.get('/privileged/updateCandidate', function(req, res, next){
	res.send('Update Candidates')
})

module.exports = router;