'use strict'

function run (msg) {
	msg.say({
		text: 'Writing out your dreams can be helpful when looking for inspiration.  Tell me about a dream you had recently?',
		"attachments": [{
			"callback_id": 'nextcancel_callback',
			actions: [
				{ name: 'answer', text: 'Next', type: 'button', value: 'next' },
				{ name: 'answer', text: 'Cancel', type: 'button', value: 'cancel' },
			]
		}]
	})
		.route('dream_response', {}, 60)
}

function response (db, msg, state) {
	// Save message sent to Creature-bot about dream
	db.saveDream(msg.body.event.user, msg.body.event.text, (err, convo) => {
		if (err)
		{
			console.log(err)
		}
	})
	msg.say(['Thanks, I have taken note.', 'Sounds good, I am keeping track of these.', 'Thanks, I am writing this down.'])
}

module.exports = {
	run: run,
	response: response
}
