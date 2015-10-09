// bot.js

var request = require("request"),
    admin = require("./admin.js"),
    Slack = require("slack-client"),
    keys = require("./keys.js"),
    login = require("./login.js");
// var Island = require("./db.js");

var api_token = keys.api_token,
    admin_token = keys.admin_token,
    slack = new Slack(api_token, true, true),
    island = {},
    mainland = {};


// initialize island
login(slack, island, mainland);


slack.on('message', function(message) {

    // Catch errors
    try {


	var channel = slack.getChannelGroupOrDMByID(message.channel);
	var user = slack.getUserByID(message.user);


	// Only listen to yoshis-story group
	if (message.channel == "G09PNS7TL") {


	    // Log message
	    if (message.type === 'message') {
		console.log("[#" + channel.name
			    + "] " + user.name
			    + " | " + message.text);
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
		var DIALOGUES = [">>> _\"Never in the field of human conflict was so much owed by so many to so few.\"  -:yoshi: Churchill_",
				 ">>> _\"Success is not final, failure is not fatal: it is the courage to continue that counts.\"  -:yoshi: Churchill_",
				 ">>> _\"Ours is a world of nuclear giants and ethical infants. We know more about war than we know about peace, more about killing than we know about living.\"  -General :yoshi: Bradley_",
				 ">>> _\"They died hard, those savage men - like wounded wolves at bay. They were filthy, and they were lousy, and they stunk. And I loved them.\"  -General :yoshi: MacArthur_",
				 ">>> _\"We must be prepared to make heroic sacrifices for the cause of peace that we make ungrudgingly for the cause of war. There is no task that is more important or closer to my heart.\"  -:yoshi: Einstein_",
				 ">>> _\"Future years will never know the seething hell and the black infernal background, the countless minor scenes and interiors of the secession war; and it is best they should not. The real war will never get in the books.\"  -:yoshi: Whitman_",
				 ">>> _\"There's no honorable way to kill, no gentle way to destroy. There is nothing good in war. Except its ending.\"  -:yoshi: Lincoln_",
				 ">>> _\"The death of one man is a tragedy. The death of millions is a statistic.\"  -:yoshi: Stalin_",
				 ">>> _\"Death solves all problems - no man, no problem.\"  -:yoshi: Stalin_",
				 ">>> _\"All wars are civil wars, because all men are brothers.\"  -:yoshi: Fenelon_",
				 ">>> _\"Only the dead have seen the end of war.\"  -:yoshi: Plato_",
				 ">>> _\"It is well that war is so terrible, or we should get too fond of it.\"  -Robert :yoshi: Lee_",
				 ">>> _\"If we don't end war, war will end us.\"  -H. G. :yoshi:_",
				 ">>> _\"It is better to die on your feet than to live on your knees!\"  -:yoshi: Zapata_",
				 ">>> _\"In war there is no substitute for victory.\"  -General :yoshi: MacArthur_",
				 ">>> _\"War does not determine who is right, only who is left.\"  -:yoshi: Russell_",
				 ">>> _\"A man may die, nations may rise and fall, but an idea lives on.\"  -John :yoshi: Kennedy_",
				 ">>> _\"All warfare is based on deception.\"  -:yoshi: Tzu_",
				 ">>> _\"Every tyrant who has lived has believed in freedom - for himself.\"  -:yoshi: Hubbard_",
				 ">>> _\"All your base are belong to us\"  -:yoshi: :yoshi: :yoshi:_",
				 ">>> _\"If our country is worth dying for in time of war let us resolve that it is truly worth living for in time of peace.\"  -:yoshi: Fish_",
				 ">>> _\"Principle is OK up to a certain point, but principle doesn't do any good if you lose.\"  -:yoshi: Cheney_"];
		var r = Math.floor(Math.random() * 3);

		var requrl = "https://mgpublic.slack.com/api/groups.kick?token=" + admin_token + "&channel=G09PNS7TL&user=" + person_id;
		request(requrl, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
			console.log(body);
		    }
		})
		channel.send(DIALOGUES[r]);
		return true;
	    };


	    // invites user
	    var inviteUser = function(person_id) {
		var requrl = "https://mgpublic.slack.com/api/groups.invite?token=" + admin_token + "&channel=G09PNS7TL&user=" + person_id;
		request(requrl, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
			console.log(body);
			channel.send(":yoshiegg: " + slack.getUserByID(person_id).name + " has been summoned :yoshiegg:");
		    }
		})
		return true;
	    };


	    // function - displays user's status
	    var status = function(text) {
		if (isUser(text)) {
		    if (!island.hasOwnProperty(text)) {
			channel.send(":yoshiegg: *" + text.split("").join(" ") + "* :yoshiegg:   [" + mainland[text][0].length + "/3]\n"
				     + "summons:  " + String(mainland[text][0]).split("").join(" "));
		    } else {
			var net = (island[text][1].length - island[text][0].length)
			channel.send(":yoshiegg: *" + text.split("").join(" ") + "* :yoshiegg:   [" + net + "/5]\n"
				     + "upvotes:  " + String(island[text][0]).split("").join(" ") + "\n"
				     + "downvotes:  " + String(island[text][1]).split("").join(" "));
		    }
		}
	    };


	    // function - writes to file
	    // someday *tear**tear*


	    // command - status
	    if (message.text.substring(0,6) == "status") {
		status(message.text.substring(7));
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
		    if (island[message.text.substring(8)][1].length - island[message.text.substring(8)][0].length >= 5) { //FIX THIS NUMBER
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
			    slack.getChannelOrGroupByID()
			}
		    }
		}
	    }



	    // command - summon
	    if (message.text.substring(0,10) == ":yoshiegg:") {
		if (isUser(message.text.substring(11))) {

		    // submit summon
		    if (mainland[message.text.substring(11)][0].indexOf(user.name, 0) == -1) {
			mainland[message.text.substring(11)][0].push(user.name);
		    }

		    // log summon
		    console.log("[" + message.text.substring(11)  + "]  summon from " + user.name);
		    console.log(">>> " + mainland[message.text.substring(11)]);
		    status(message.text.substring(11));

		    // perform summoning
		    if (mainland[message.text.substring(11)][0].length >= 3) { //FIX THIS NUMBER
			mainland[message.text.substring(11)][0] = []
			inviteUser(mainland[message.text.substring(11)][1]);
			island[message.text.substring(11)] = [[], [], mainland[message.text.substring(11)][1]]
			console.log("[" + message.text.substring(11) + "]  has been summoned");
		    }
		} else {

		    // add user to mainland if they recently joined
		    //if (slack.channels.C055V3V3A.members.hasOwnProperty(message.text.substring(11))) {
			//
		    //}
		}
	    }


	    // command - help
	    if (message.text == "help") {
		channel.send(""
			     + "UPVOTE:      `:randall: [username]`\n"
			     + "DOWNVOTE:    `:yoshi: [username]`\n"
			     + "SUMMON:      `:yoshiegg: [username]`\n"
			     + "VIEW STATUS: `status [username]`\n"
			     + "ROLL DICE:   `roll`");
	    }


	    // when user leaves group, reinvite them
	    if (message.text.indexOf("has left the group", 0) != -1) {
		if (island.hasOwnProperty(slack.getUserByID(message.user).name)) {
		    inviteUser(message.user);
		}
		channel.send(":yoshi: " + slack.getUserByID(message.user).name);
	    }


	    // command - add
	    if (message.text.substring(0,3) == "add" && isUser(message.text.substring(4))) {
		channel.send("==> " + message.text.substring(4));
		channel.send("{ [MongoError: connect ECONNREFUSED] name: 'MongoError', message: 'connect ECONNREFUSED' }");
		Island.addUser(message.text.substring(4),
			       island[message.text.substring(4)][2],
			       island[message.text.substring(4)][0],
			       island[message.text.substring(4)][1]);
		Island.findUser(message.text.substring(4));
	    }


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


	    // shameless self-promotion
	    if (message.text.toLowerCase().indexOf("face the falcon", 0) != -1) {
		channel.send("https://www.youtube.com/watch?v=YXPLysfBeag");
		console.log("Posted \"Face The Falcon\"");
	    }
	    if (message.text.toLowerCase().indexOf("embrace the falcon", 0) != -1) {
		channel.send("https://www.youtube.com/watch?v=fG982Lt-F7k");
		console.log("Posted \"Embrace The Falcon\"");
	    }


	    // command - "who is your daddy?"
	    if (message.text.toLowerCase().indexOf("who is your daddy?", 0) != -1) {
		if (user.name == "durr") {
		    channel.send("You're my daddy :randall:");
		} else {
		    channel.send("durr's my daddy :randall:");
		}
	    }
	}


	// global command - ?
	if (message.text == "?") {
	    channel.send("[" + slack.getUserByID(message.user).name.split("").join(" ") + "]"
			 + "\nuser ID: " + message.user
			 + "\nchannel ID: " + message.channel);
	}


    } catch (err) {}
});
