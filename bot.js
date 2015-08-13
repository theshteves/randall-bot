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
	    island[slack.getUserByID(person_id).name] = [["smaple"], ["sample"], ["sapmle"]];
    });
    console.log("\n[=====[THE ISLAND]=====]\n", island);
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
	channel.send(":yoshiegg: " + message.text.substring(7) + " :yoshiegg:\n"
		     + "upvotes: " + island[message.text.substring(7)][0] + "\n"
		     + "downvotes: " + island[message.text.substring(7)][1]);
    }


    // command - upvote


    // command - downvote


    // Shameless self-promotion
    if (message.text.indexOf("Face The Falcon", 0) != -1) {
	channel.send("https://www.youtube.com/watch?v=YXPLysfBeag");
    }
    if (message.text.indexOf("Embrace The Falcon", 0) != -1) {
	channel.send("https://www.youtube.com/watch?v=fG982Lt-F7k");
    }


    /*
      User-specific commands
    */

    // "Who'a your daddy?"
    if (message.text.indexOf("Who's your daddy?", 0) != -1) {
	console.log(user.name);
	if (user.name == "durr") {
	    channel.send("You're my daddy :randall:");
	} else {
	    channel.send("durr's my daddy :randall:");
	}
    }
});
