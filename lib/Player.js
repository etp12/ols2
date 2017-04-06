const mongoose = require('mongoose');
const dbuser = process.argv[3];
const dbpass = process.argv[4];

//register models
const Team = require('../models/Team');
const Player = require('../models/Player');
const Contract = require('../models/Contract');

mongoose.connect('mongodb://' + dbuser +':' + dbpass +
'@ds147510.mlab.com:47510/olsdev');

function createPlayer(a_ign, a_elo, a_isOwner, cb) {
	//create player
	let newPlayer = new Player({
		name: a_ign,
		elo: a_elo,
		isOwner: a_isOwner
	});

		//save the new user
	newPlayer.save(function(err) {
		if (err) cb('Error creating new player ' + a_ign);
		else cb(a_ign + ' successfully created.')
	});
}
