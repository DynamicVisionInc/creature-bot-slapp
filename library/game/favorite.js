'use strict'

function run (db, msg) {
	// Get random favorite to ask about
	db.getRandomFavorite((err, message) => {
		if (err) {
			console.error(err)
		}

		msg.say('What is your favorite ' + message + "?")
			.route('favorite_response', { 'favorite' : message })

	})
}

function response (db, msg, state) {
	var favorite = state.favorite
	db.saveUserFavorite(msg.body.event.user, {  favorite : msg.body.event.text, type : favorite }, (err, convo) => {
		if (err)
		{
			console.log(err)
		}
	})
	msg.say('Great, thanks.')
}

module.exports = {
	run: run,
	response: response
}
