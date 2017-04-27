const mongoose = require('mongoose');
const config = require('config.json')('config.json');

//register models
const Player = require('../models/Player');
const User = require('../models/User');

exports.createPlayer = function(uname, a_ign, a_elo, cb) {
	//find user
	User.findOne({username: uname}, function(err, userAccount) {
		if (err) cb('Unable to find ' + uname);
		else {
			//create player
			let newPlayer = new Player({
				ign: a_ign,
				elo: a_elo,
				user: userAccount
			});

				//save the new user
			newPlayer.save(function(err) {
				if (err) cb('Error creating new player ' + a_ign);
				else cb(a_ign + ' successfully created.')
			});

			if (!userAccount.accounts) userAccount.accounts = [];
			userAccount.accounts.push(newPlayer);
			userAccount.save(function(err) {
				if (err) cb('Error linking ' + newPlayer.ign + ' to ' + uname);
			});
		}
	});
}
