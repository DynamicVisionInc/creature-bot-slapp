'use strict'

const Helper = require('../helper.js')

function run (db, msg) {
	// Get random favorite to ask about
	db.getRandomFavorite((err, message) => {
		if (err) {
			console.error(err)
		}
		msg.say({
			text: '',
			attachments: [
			{
				text : 'What is your favorite ' + message + '?',
				callback_id: 'nextcancel_callback',
				actions: [
					{ name: 'answer', text: 'Next', type: 'button', value: 'next' },
					{ name: 'answer', text: 'Cancel', type: 'button', value: 'cancel' },
				]
			}]
		})
			.route('favorite_response', { 'favorite' : message }, 60)

	})
}

function response (db, msg, state) {
	var user = Helper.returnUserFromMsg(msg)
	var message = Helper.returnMessageFromMsg(msg)

	if (user && message)
	{
		var favorite = state.favorite
		db.saveUserFavorite(user, {  favorite : message, type : favorite }, (err, convo) => {
			if (err)
			{
				console.log(err)
			}
		})
		msg.say('Great, thanks.')
	}
}

module.exports = {
	run: run,
	response: response
}
