'use strict'

function run (db, msg) {
	// Get random favorite to ask about
	db.getRandomDecodeMessage((err, message) => {
		if (err) {
			console.error(err)
		}
		msg.say('What is your favorite ' + message)
			.route('favorite_response')
	})
}

function response (msg) {
	msg.say('Great, thanks.')
}

module.exports = {
	run: run,
	response: response
}
