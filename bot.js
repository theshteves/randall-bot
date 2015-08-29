// bot.js

var request = require("request");
var Slack = require("slack-client");
var keys = require("./keys.js");
//var User = require("./db.js");

var token = keys.token;
var slack = new Slack(token, true, true);


// Initialize island
var island = {};
var mainland = {};

slack.on('open', function () {
    // Notify the group on startup
    slack.groups.G09PNS7TL.send(":yoshiegg: [BOOTING UP]");
    slack.groups.G09PNS7TL.send(":yoshiegg:");
    slack.groups.G09PNS7TL.send(":yoshiegg:");

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

    // For debugging purposes only:  console.log("<SLACK>\n\n", slack.groups, "\n\n</SLACK>");

    // Fill mainland with all players
    slack.channels.C055V3V3A.members.forEach(function(person_id) {
	mainland[slack.getUserByID(person_id).name] = [[], person_id];
    });
    console.log("\n[=====[THE MAINLAND]=====]\n", mainland, "\n");


    // Fill island with #yoshis-story players
    slack.groups.G09PNS7TL.members.forEach(function(person_id) {
	island[slack.getUserByID(person_id).name] = [[], [], person_id];
    });
    console.log("\n[=====[THE ISLAND]=====]\n", island, "\n");

    slack.groups.G09PNS7TL.send(":randall:");
});


slack.login();


slack.on('message', function(message) {
    // Catch errors
    try {


	var channel = slack.getChannelGroupOrDMByID(message.channel);
	var user = slack.getUserByID(message.user);


	// Only listen to yoshis-story group
	if (message.channel == "G09PNS7TL") {


	    // Log message
	    if (message.type === 'message') {
		console.log("[#" + channel.name + "] " + user.name + " | " + message.text);
	    }


	    // Verifies if text represents player
	    var isUser = function(text) {
		if (island.hasOwnProperty(text)) {
		    return true;
		}
		if (mainland.hasOwnProperty(text)) {
		    return true;
		}
		return false;
	    };


	    // kicks user
	    var kickUser = function(person_id) {
		var DIALOGUES = ["_a screach was heard in the distance__",
				 "_they must atone for their sins__",
				 "_there was not a sound to be heard in the jungle_"];
		var r = Math.floor(Math.random() * 3);

		var requrl = "https://mgpublic.slack.com/api/groups.kick?token=xoxp-5199131090-6040919457-9806431428-2b26d0&channel=G09PNS7TL&user=" + person_id;
		request(requrl, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
			console.log(body);
		    }
		})
		channel.send(DIALOGUES(r));
		return true;
	    };


	    // invites user
	    var inviteUser = function(person_id) {
		var requrl = "https://mgpublic.slack.com/api/groups.invite?token=xoxp-5199131090-6040919457-9806431428-2b26d0&channel=G09PNS7TL&user=" + person_id;
		request(requrl, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
			console.log(body);
			channel.send(":yoshiegg: " + slack.getUserByID(person_id).name + " has been summoned :yoshiegg:");
		    }
		})
		return true;
	    };


	    // displays user's status
	    var status = function(text) {
		if (isUser(text)) {
		    if (!island.hasOwnProperty(text)) {
			channel.send(":yoshiegg: " + text.split("").join(" ") + " :yoshiegg:   [" + mainland[text][0].length + "/4]\n"
				     + "summons:  " + String(mainland[text][0]).split("").join(" "));
		    } else {
			var net = (island[text][1].length - island[text][0].length)
			channel.send(":yoshiegg: " + text.split("").join(" ") + " :yoshiegg:   [" + net + "/4]\n"
				     + "upvotes:  " + String(island[text][0]).split("").join(" ") + "\n"
				     + "downvotes:  " + String(island[text][1]).split("").join(" "));
		    }
		}
	    };


	    // command - status
	    if (message.text.substring(0,6) == "status" && isUser(message.text.substring(7))) {
		var usr = message.text.substring(7);
		if (!island.hasOwnProperty(usr)) {
		    channel.send(":yoshiegg: " + usr.split("").join(" ") + " :yoshiegg:   [" + mainland[usr][0].length + "/4]\n"
				 + "summons:  " + String(mainland[usr][0]).split("").join(" "));
		} else {
		    var net = (island[usr][1].length - island[usr][0].length)
		    channel.send(":yoshiegg: " + usr.split("").join(" ") + " :yoshiegg:   [" + net + "/4]\n"
				 + "upvotes:  " + String(island[usr][0]).split("").join(" ") + "\n"
				 + "downvotes:  " + String(island[usr][1]).split("").join(" "));
		}
	    }


	    // command - upvote
	    if (message.text.substring(0,9) == ":randall:" && isUser(message.text.substring(10))) {

		// downvote user if they try to upvote bot
		if (message.text.substring(10,22) == "randall-bot") {
		    channel.send(user.name + " hahaha _no._");
		    if (island[user.name][1].indexOf("randall-bot", 0) == -1) {
			island[user.name][1].push("randall-bot");
			status(user.name);
		    }
		} else {

		    // submit upvote
		    if (island[message.text.substring(10)][0].indexOf(user.name, 0) == -1) {
			island[message.text.substring(10)][0].push(user.name);
		    }

		    // remove downvote if necessary
		    if (island[message.text.substring(10)][1].indexOf(user.name, 0) != -1) {
			island[message.text.substring(10)][1].splice(island[message.text.substring(10)][1].indexOf(user.name), 1);
		    }

		    // log upvote
		    console.log("[" + message.text.substring(10)  + "]  +1 from " + user.name);
		    console.log(">>> " + island[message.text.substring(10)]);
		    status(message.text.substring(10));
		}
	    }


	    // command - downvote
	    if (message.text.substring(0,7) == ":yoshi:" && isUser(message.text.substring(8))) {

		// downvote user if they try to downvote bot
		if (message.text.substring(8,20) == "randall-bot") {
		    channel.send(user.name + " hahaha _no._");
		    if (island[user.name][1].indexOf("randall-bot", 0) == -1) {
			island[user.name][1].push("randall-bot");
			status(user.name);
		    }
		} else {

		    // submit downvote
		    if (island[message.text.substring(8)][1].indexOf(user.name, 0) == -1) {
			island[message.text.substring(8)][1].push(user.name);
		    }

		    // remove upvote if necessary
		    if (island[message.text.substring(8)][0].indexOf(user.name, 0) != -1) {
			island[message.text.substring(8)][0].splice(island[message.text.substring(8)][0].indexOf(user.name), 1);
		    }

		    // log downvote
		    console.log("[" + message.text.substring(8)  + "]  -1 from " + user.name);
		    console.log(">>> " + island[message.text.substring(8)]);
		    status(message.text.substring(8));

		    // kick user off island
		    if (island[message.text.substring(8)][1].length - island[message.text.substring(8)][0].length >= 4) { //FIX THIS NUMBER
			console.log("[" + message.text.substring(8) + "]  has been voted off");
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
			    island["durr"] = [[], [], "U081VGKU1"];
			} else {
			    mainland[message.text.substring(8)][0] = [];
			    island[message.text.substring(8)][0] = [];
			    island[message.text.substring(8)][1] = [];
			    kickUser(island[message.text.substring(8)][2]);
			}
		    }
		}
	    }



	    // command - summon
	    if (message.text.substring(0,10) == ":yoshiegg:" && isUser(message.text.substring(11))) {
		// submit summon
		if (mainland[message.text.substring(11)][0].indexOf(user.name, 0) == -1) {
		    mainland[message.text.substring(11)][0].push(user.name);
		}

		// log summon
		console.log("[" + message.text.substring(11)  + "]  summon from " + user.name);
		console.log(">>> " + mainland[message.text.substring(11)]);
		status(message.text.substring(11));

		// perform summoning
		if (mainland[message.text.substring(11)][0].length >= 4) { //FIX THIS NUMBER
		    mainland[message.text.substring(11)][0] = []
		    inviteUser(mainland[message.text.substring(11)][1]);
		    island[message.text.substring(11)] = [[], [], mainland[message.text.substring(11)][1]]
		    console.log("[" + message.text.substring(11) + "]  has been summoned");
		}
	    }


	    // shameless self-promotion
	    if (message.text.toLowerCase().indexOf("face the falcon", 0) != -1) {
		channel.send("https://www.youtube.com/watch?v=YXPLysfBeag");
		console.log("Posted \"Face The Falcon\"");
	    }
	    if (message.text.toLowerCase().indexOf("embrace the falcon", 0) != -1) {
		channel.send("https://www.youtube.com/watch?v=fG982Lt-F7k");
		console.log("Posted \"Embrace The Falcon\"");
	    }


	    // command - "SD"
	    /*
	      if (message.text.toUpperCase().indexOf("SD", 0) != -1) {
	      channel.send(user.name + "   ...I got you, bro");
	      }
	    */


	    // command - help
	    if (message.text == "help") {
		channel.send(//slack.getUserByID(message.user).name + ", I got you bro.\n" +
		    "UPVOTE:     `:randall: [username]`\n"
			+ "DOWNVOTE: `:yoshi: [username]`\n"
			+ "SUMMON:   `:yoshiegg: [username]`");
	    }


	    /*
	      user-specific commands
	    */
	    /*
	      if (user.name == "durr") {

	      // command - help
	      if (message.text.substring(0,4) == "help") {
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
	    */


	    // command - roll
	    if (message.text.substring(0,4) == "roll") {
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


	    // command - "who is your daddy?"
	    if (message.text.toLowerCase().indexOf("who is your daddy?", 0) != -1) {
		if (user.name == "durr") {
		    channel.send("You're my daddy :randall:");
		} else {
		    channel.send("durr's my daddy :randall:");
		}
	    }


	    if (message.text.substring(0, 1) == "#") {
		/* --- Insert Bot Commands "#[command]" --- */


		// #hey
		if (message.text.substring(1,4) == "hey") {
		    channel.send("hey, " + user.name);
		}


		// #help
		if (message.text.substring(1,5) == "help") {
		    channel.send(user.name + " nah.");
		}


	    }
	}


	// Commands for outside of yoshis-story
	// command - ?
	if (message.text == "?") {
	    channel.send(slack.getUserByID(message.user).name + "'s user ID is " + message.user);
	}


    } catch (err) {}
});
