// db.js

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server.");

    insertDocuments(db, function() {
	db.close();
    });
});

var insertDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Insert some documents
    collection.insert([
	{a : 1}, {a : 2}, {a : 3}
    ], function(err, result) {
	assert.equal(err, null);
	assert.equal(3, result.result.n);
	assert.equal(3, result.ops.length);
	console.log("Inserted 3 documents into the document collection");
	callback(result);
    });
}

/*
exports.addUser = function(user) {
    // Adds user

};

exports.findUser = function(user) {
    // Finds user

};

exports.upUser = function(user) {
    // Upvotes user

};

exports.downUser = function(user) {
    // Downvotes user

};

exports.removeUser = function(user) {
    // Removes User

};
*/
