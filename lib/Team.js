const mongoose = require('mongoose');
const config = require('config.json')('config.json');

//register models
const Player = require('../models/Player');
const User = require('../models/User');
const Team = require('../models/Team');

exports.createTeam = function(teamName, uname, cb) {
	//find the player, make sure they are an owner, and then set their team
	User.findOne({username: uname}, function(err, user) {
		if (err || !user) cb('Error finding ' + uname);
		else if (!user.isOwner) cb('Please give ' + uname + ' ownership rights first');
		else {
			//create new team now
			let newTeam = new Team({
				name: teamName,
				owner: user,
				players: []
			});

			user.team = newTeam;

			user.save(function(err) {
				if (err) cb('Error updating owner: ' + err);
				else {
					//save the team roster
					newTeam.save(function(err) {
						if (err) cb('Error creating new team: ' + err);
						else cb('Team ' + teamName + ' created with owner ' + uname);
					});
				}
			});
		}
	});
}

exports.listPlayers = function(teamName, cb) {
	//find the team
	Team.findOne({name: teamName})
		.populate('players')
		.exec(function (err, team) {
		  if (err) cb('Error listing players');
			else{
				//print the roster in one string
				let outStr = 'Team ' + teamName + ' has:';
				team.players.forEach(function(player) {
					outStr += '\n' + player.ign + ' with an elo of: ' + player.elo;
				});
				cb(outStr);
			}
		});
}

exports.addPlayerToTeam = function(a_ign, teamName, cb) {
	//update the team's roster first
	Team.findOne({name: teamName}, function(err, team) {
		if (err) cb('Error updating the ' + teamName + 'roster');
		else if (!team) cb(teamName + ' does not exist!');
		else {
			//now find the user to update their team
			Player.findOne({ign: a_ign})
				.populate('user')
				.exec(function(err, player) {
				if (err) cb('Error updating ' + playerName + '\'s team');
				if (!player) cb(playerName + ' does not exist!');
				else {
					if (!team.players) team.players = [];
					team.players.push(player);
					player.user.team = team;

					player.save(function(err) {
						if (err) cb('Error adding player to team!');
						else {
							team.save(function(err) {
								if (err) cb('Error adding ' + playerName + 'to ' + teamName);
								else cb(a_ign + ' added to ' + teamName + ' successfully');
							});
						}
					});
				}
			}); //finding the user
		}
	}); //finding the team
}
