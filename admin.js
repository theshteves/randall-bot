process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (text) {
    console.log(text);
    /*
    if (text.trim() === '') {
	done();
    }
    */
});

function done() {
    console.log('Now that process.stdin is paused, there is nothing more to do.');
    process.exit();
}
