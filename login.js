// login.js

module.exports = function (slack, island, mainland) {

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
};
