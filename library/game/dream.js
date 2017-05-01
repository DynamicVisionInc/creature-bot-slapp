'use strict'

function run (db) {
	msg.say('Writing out your dreams can be helpful when looking for inspiration.  Tell me about a dream you had recently?')
		.route('dream_response')
}

function response (db, msg, state) {
	// Save message sent to Creature-bot about dream
	db.saveDream(msg.body.event.user, msg.body, (err, convo) => {
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
