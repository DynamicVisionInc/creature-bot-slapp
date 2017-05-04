'use strict'

const Helper = require('../helper.js')

function run (msg) {
	msg.say({
		text: '',
		attachments: [
		{
			text: 'Writing out your dreams can be helpful when looking for inspiration.  Tell me about a dream you had recently?',
			callback_id: 'nextcancel_callback',
			actions: [
				{ name: 'answer', text: 'Next', type: 'button', value: 'next' },
				{ name: 'answer', text: 'Cancel', type: 'button', value: 'cancel' },
			]
		}]
	})
		.route('dream_response', { }, 60)
}

function response (db, msg, state) {
	var user = Helper.returnUserFromMsg(msg)
	var message = Helper.returnMessageFromMsg(msg)
	if (user && message)
	{
		// Save message sent to Creature-bot about dream
		db.saveDream(user, message, (err, convo) => {
			if (err)
			{
				console.log(err)
			}
		})
		msg.respond(msg.body.response_url, {
			text: '',
			attachments: [
			{
				text: 'Writing out your dreams can be helpful when looking for inspiration.  Tell me about a dream you had recently?'
			}]
		})
			.say(['Thanks, I have taken note.', 'Sounds good, I am keeping track of these.', 'Thanks, I am writing this down.'])
	}
}

module.exports = {
	run: run,
	response: response
}
