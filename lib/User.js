const mongoose = require('mongoose');
const config = require('config.json')('config.json');

//register models
const Team = require('../models/Team');
const User = require('../models/User');

exports.createUser = function(owner, player, admin, uname, cb) {

	let newUser = new User({
		isOwner: owner,
		isPlayer: player,
		isAdmin: admin,
		username: uname,
		accounts: []
	});

	newUser.save(function(err) {
		if (err) cb('Error creating new user ' + uname);
		else cb('User ' + uname + ' successfully created.');
	});

}

exports.setUserTeam = function(uname, teamName, cb) {
	Team.findOne({name: teamName}, function(err, team) {
		if (err) cb('Error finding team: ' + teamName);
		else {
			User.findOne({username: uname}, function(err, user) {
				if (err) cb('Error finding user: ' + uname);
				else {
					user.team = team;
					user.save(function(err) {
						if(err) cb('Error saving user');
						else cb('Successfully set ' + uname + '\'s team to ' + teamName);
					});
				}
			});
		}
	});
}
