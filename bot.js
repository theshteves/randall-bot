// bot.js

var Slack = require("slack-client");
var keys = require("./keys.js");
//var db = require("./db.js");

var token = keys.token;
var slack = new Slack(token, true, true);


// Initialize island
var island = {};
var mainland = {};

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


    // Fill mainland with all players
    slack.channels.C08V4MUSF.members.forEach(function(person_id) {
	    mainland[slack.getUserByID(person_id).name] = [];
    });
    console.log("\n[=====[THE MAINLAND]=====]\n", mainland, "\n");


    // Fill island with #yoshis-story players
    slack.channels.C08V4V25T.members.forEach(function(person_id) {
	    island[slack.getUserByID(person_id).name] = [[], []];
    });
    console.log("\n[=====[THE ISLAND]=====]\n", island, "\n");
});


slack.login();


slack.on('message', function(message) {
    // Catch errors
    try {


	var channel = slack.getChannelGroupOrDMByID(message.channel);
	var user = slack.getUserByID(message.user);


	// Log message
	if (message.type === 'message') {
	    console.log("[#" + channel.name + "] " + user.name + " | " + message.text);
	}


	// Verifies if text represents player
	var isUser = function(text) {
	    if (island.hasOwnProperty(text)) {
		return true;
	    }
	    return false;
	};


	// kicks user
	var kickUser = function(person) {
	    var DIALOGUES = ["_a screach was heard in the distance__",
			     "_they must atone for their sins__",
			     "_there was not a sound to be heard in the jungle_"];
	    var r = true; //random number


	    /* --- actually kicks user --- */
	    channel.send(ENDING(r));
	    return true;
	};


	// command - status
	if (message.text.substring(0,6) == "status" && isUser(message.text.substring(7))) {
	    var usr = message.text.substring(7);
	    channel.send(":yoshiegg: " + usr.split("").join(" ") + " :yoshiegg:\n"
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
	    // kick user off island
	    if (island[message.text.substring(8)][1].length - island[message.text.substring(8)][0].length >= 3) {
		console.log("[" + message.text.substring(8) + "]  has been voted off");
		island[message.text.substring(8)][0] = [];
		island[message.text.substring(8)][1] = [];
		mainland[message.text.substring(8)] = [];
		channel.send(":yoshi::yoshi::yoshi::yoshiegg: " + message.text.substring(8) + " has been seized :yoshiegg::yoshi::yoshi::yoshi:");
		if (message.text.substring(8) == "durr") {
		    channel.send(":yoshi::yoshi::yoshi::yoshiegg: durr must atone for his sins :yoshiegg::yoshi::yoshi::yoshi:");
		    channel.send(":yoshi::yoshi::yoshi::yoshi::yoshi::yoshi::yoshi:|\n" +
				 ":yoshi::yoshi::yoshi::yoshi::yoshi::yoshi::yoshi:|\n" +
				 ":yoshi::yoshi::yoshi::yoshi::yoshi::yoshi::yoshi:|\n" +
				 ":yoshi::yoshi::yoshi::yoshi::yoshi::yoshi::yoshi:|\n" +
				 ":yoshi::yoshi::yoshi::yoshi::yoshi::yoshi::yoshi:|              ---> :randall: I got you, durr :randall:\n" +
				 ":yoshi::yoshi::yoshi::yoshi::yoshi::yoshi::yoshi:|\n" +
				 ":yoshi::yoshi::yoshi::yoshi::yoshi::yoshi::yoshi:|\n" +
				 ":yoshi::yoshi::yoshi::yoshi::yoshi::yoshi::yoshi:|\n" +
				 ":yoshi::yoshi::yoshi::yoshi::yoshi::yoshi::yoshi:|\n");
		} else {
		    kickUser(message.text.substring(8));
		}
	    }
	}



	// command - summon
	if (message.text.substring(0,10) == ":yoshiegg:" && isUser(message.text.substring(11))) {
	    // submit summon
	    console.log("[" + message.text.substring(8)  + "]  summon from " + user.name);
	    if (mainland[message.text.substring(11)].indexOf(user.name, 0) == -1) {
		mainland[message.text.substring(11)].push(user.name);
	    }
	    // execute summon
	    if (mainland[message.text.substring(11)] == 3) {
		console.log("[" + message.text.substring(11) + "]  has been summoned");
		//message.text.substring(11)
	    }
	}


	// shameless self-promotion
	if (message.text.indexOf("Face The Falcon", 0) != -1) {
	    channel.send("https://www.youtube.com/watch?v=YXPLysfBeag");
	}
	if (message.text.indexOf("Embrace The Falcon", 0) != -1) {
	    channel.send("https://www.youtube.com/watch?v=fG982Lt-F7k");
	}


	// command - "SD"
	if (message.text.toUpperCase().indexOf("SD", 0) != -1) {
	    channel.send(user.name + "   ...I got you, bro");
	}


	/*
	  user-specific commands
	*/
	if (user.name == "durr") {


	    // command - help
	    if (message.text.substring(0,4) == "help" && user.name == "durr") {
		channel.send(":yoshi::yoshi::yoshi::yoshi::yoshi::yoshi::yoshi:|\n" +
			     ":yoshi::yoshi::yoshi::yoshi::yoshi::yoshi::yoshi:|\n" +
			     ":yoshi::yoshi::yoshi::yoshi::yoshi::yoshi::yoshi:|\n" +
			     ":yoshi::yoshi::yoshi::yoshi::yoshi::yoshi::yoshi:|\n" +
			     ":yoshi::yoshi::yoshi::yoshi::yoshi::yoshi::yoshi:|              ---> :randall: I got you, durr :randall:\n" +
			     ":yoshi::yoshi::yoshi::yoshi::yoshi::yoshi::yoshi:|\n" +
			     ":yoshi::yoshi::yoshi::yoshi::yoshi::yoshi::yoshi:|\n" +
			     ":yoshi::yoshi::yoshi::yoshi::yoshi::yoshi::yoshi:|\n" +
			     ":yoshi::yoshi::yoshi::yoshi::yoshi::yoshi::yoshi:|\n");
	    }
	}


	// command - "Who is your daddy?"
	if (message.text.toLowerCase().indexOf("who is your daddy?", 0) != -1) {
	    if (user.name == "durr") {
		channel.send("You're my daddy :randall:");
	    } else {
		channel.send("durr's my daddy :randall:");
	    }
	}

	if (message.text.substring(0, 1) == "!") {
	    /* --- Insert Bot Commands "![command]" --- */


	    // !hey
	    if (message.text.substring(1,4) == "hey") {
		channel.send("hey, " + user.name);
	    }


	    // !roll
	    if (message.text.substring(1,5) == "roll") {
		var fate = "";
		for (var i = 0; i < 2; i++) {
		    var roll = Math.floor(Math.random() * 6) + 1;
		    switch (roll) {
		    case 1:
			roll = ":one:";
			break;
		    case 2:
			roll = ":two:";
			break;
		    case 3:
			roll = ":three:";
			break;
		    case 4:
			roll = ":four:";
			break;
		    case 5:
			roll = ":five:"
			break;
		    case 6:
			roll = ":six:";
			break;
		    }
		    fate += " " + roll;
		}
		channel.send(user.name + fate);
	    }


	    // !help
	    if (message.text.substring(1,5) == "help") {
		channel.send(user.name + " nah.");
	    }


	}

    } catch (err) {}
});
