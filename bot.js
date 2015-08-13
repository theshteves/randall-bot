// bot.js

var Slack = require("slack-client");
var keys = require("./keys.js");

var token = keys.token;
var slack = new Slack(token, true, true);


// Initialize island
var island = {};


slack.on('open', function () {
    var channels = Object.keys(slack.channels)
	.map(function (k) { return slack.channels[k]; })
	.filter(function (c) { return c.is_member; })
	.map(function (c) { return c.name; });
    var groups = Object.keys(slack.groups)
	.map(function (k) { return slack.groups[k]; })
	.filter(function (g) { return g.is_open && !g.is_archived; })
	.map(function (g) { return g.name; });


    // Login Info Display
    console.log('Welcome to Slack. You are ' + slack.self.name + ' of ' + slack.team.name);
    if (channels.length > 0) {
	console.log('You are in: ' + channels.join(', '));
    }
    else {
	console.log('You are not in any channels.');
    }
    if (groups.length > 0) {
	console.log('As well as: ' + groups.join(', '));
    }


    // Fill island with players
    slack.channels.C08V4V25T.members.forEach(function(person_id) {
	    island[slack.getUserByID(person_id).name] = [[], [], []];
    });
    console.log("\n[=====[THE ISLAND]=====]\n", island, "\n");
});


slack.login();


slack.on('message', function(message) {
    var channel = slack.getChannelGroupOrDMByID(message.channel);
    var user = slack.getUserByID(message.user);


    // Log message
    if (message.type === 'message') {
	try {
	    console.log("[#" + channel.name + "] " + user.name + " | " + message.text);
	} catch (err) {} // For "user is not defined" error
    }


    // Verifies if text represents player
    var isUser = function(text) {
	if (island.hasOwnProperty(text)) {
	    return true;
	}
	return false;
    };


    // command - status
    if (message.text.substring(0,6) == "status" && isUser(message.text.substring(7))) {
	var usr = message.text.substring(7);
	channel.send(":yoshiegg: " + usr + " :yoshiegg:\n"
		     + "upvotes: " + island[usr][0] + "\n"
		     + "downvotes: " + island[usr][1]);
    }


    // command - upvote
    if (message.text.substring(0,9) == ":randall:" && isUser(message.text.substring(10))) {
	// submit upvote
	console.log("[" + message.text.substring(10)  + "]  +1 from " + user.name);
	if (island[message.text.substring(10)][0].indexOf(user.name, 0) == -1) {
	    island[message.text.substring(10)][0].push(user.name);
	}
	// remove downvote if necessary
	if (island[message.text.substring(10)][1].indexOf(user.name, 0) != -1) {
	    island[message.text.substring(10)][1].splice(island[message.text.substring(10)][1].indexOf(user.name), 1);
	}
    }


    // command - downvote
    if (message.text.substring(0,7) == ":yoshi:" && isUser(message.text.substring(8))) {
	// submit downvote
	console.log("[" + message.text.substring(8)  + "]  -1 from " + user.name);
	if (island[message.text.substring(8)][1].indexOf(user.name, 0) == -1) {
	    island[message.text.substring(8)][1].push(user.name);
	}
	// remove upvote if necessary
	if (island[message.text.substring(8)][0].indexOf(user.name, 0) != -1) {
	    island[message.text.substring(8)][0].splice(island[message.text.substring(8)][0].indexOf(user.name), 1);
	}
    }


    // command - summon
    if (message.text.substring(0,10) == ":yoshiegg:" && isUser(message.text.substring(11))) {
	// submit summon
	console.log("[" + message.text.substring(8)  + "]  summon from " + user.name);
	if (island[message.text.substring(11)][2].indexOf(user.name, 0) == -1) {
	    island[message.text.substring(11)][2].push(user.name);
	}
    }

    /*
      durr-specific commands
    */

    // Shameless self-promotion
    if (message.text.indexOf("Face The Falcon", 0) != -1) {
	channel.send("https://www.youtube.com/watch?v=YXPLysfBeag");
    }
    if (message.text.indexOf("Embrace The Falcon", 0) != -1) {
	channel.send("https://www.youtube.com/watch?v=fG982Lt-F7k");
    }


    // command - "Who's your daddy?"
    if (message.text.indexOf("Who's your daddy?", 0) != -1) {
	console.log(user);
	if (user == "durr") {
	    channel.send("You're my daddy :randall:");
	} else {
	    channel.send("durr's my daddy :randall:");
	}
    }



});
