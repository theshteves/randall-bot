// bot.js

var Slack = require("slack-client");
var keys = require("./keys.js");

var token = keys.token;
var slack = new Slack(token, true, true);

// Initialize Island Object Constructor
function island(user, upvotes, downvotes) {
    this.user = user;
    this.upvotes = upvotes;
    this.downvotes = downvotes;
}

// Define function getUser for listing all users
var getUsers = function(channel) {
    if (channel.name != "yoshis-story") {
	return [];
    }

    var user_list = [];
    for (var i = 0; i < channel.members.length; i++) {
	user_list.push(slack.getUserByID(channel.members[i]).name);
    }
    return user_list;
};


slack.on('open', function () {
    var channels = Object.keys(slack.channels)
	.map(function (k) { return slack.channels[k]; })
	.filter(function (c) { return c.is_member; })
	.map(function (c) { return c.name; });

    var groups = Object.keys(slack.groups)
	.map(function (k) { return slack.groups[k]; })
	.filter(function (g) { return g.is_open && !g.is_archived; })
	.map(function (g) { return g.name; });

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

});

slack.login();

slack.on('message', function(message) {
    var channel = slack.getChannelGroupOrDMByID(message.channel);
    var user = slack.getUserByID(message.user);


    // Verify that user is on Island


    // Log message
    if (message.type === 'message') {
	console.log("[#" + channel.name + "] " + user.name + " | " + message.text);
    }


    // User upvote
    if (message.text.indexOf(":yoshiegg:") != -1 ) {
	var the_msg = message.text.substring(message.text.indexOf(":yoshiegg:"));

	//if (the_msg.indexOf(user.name) != -1 )
	//{

	//}
    }


    // User downvote



    // User status
    if (message.text.substring(0,6) == "status") {
	console.log(getUsers(channel));

	if (message.text.indexOf(getUsers(channel), 0)) {
	    channel.send("[" + message.text.substring(7) + "]\n:yoshiegg: 1\n:yoshi: 0");
	}
    }
});
