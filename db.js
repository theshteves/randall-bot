// db.js

// grab the things we need
var mongoose = require('mongoose');
var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function(callback) {


    // Create your schemas and models here.
    var Schema = mongoose.Schema;


    // create a schema
    var islandSchema = new Schema({
	name: String,
	id: String,
	up: Array,
	down: Array
    });


    // the schema is useless so far
    // we need to create a model using it
    var Island = mongoose.model('Island', islandSchema);


    // make this available to our users in our Node applications
    module.exports = Island;


    exports.addUser = function(username, user_id, upvotes, downvotes) {
	// Adds user
	new Island({
	    name: username,
	    id: user_id,
	    up: upvotes,
	    down: downvotes
	}).save();
    };


    exports.findUser = function(username) {
	// Finds user
	Island.findOne({ name: username }, function(err, results) {
	    if (err) return console.error(err);
	    console.dir(results);
	});
    };


    exports.upvote = function(username, upvotes) {
	// Upvotes user
	Island.findOneAndModify({name: username}, {up: upvotes}, {upsert:true}, function(err, results) {
	    if (err) return console.error(err);
	    console.dir(results);
	});
    };


    exports.downvote = function(username) {
	// Downvotes user

    };


    exports.removeUser = function(username) {
	// Removes User

    };
});

mongoose.connect('mongodb://localhost/island');
