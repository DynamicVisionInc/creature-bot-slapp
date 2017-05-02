'use strict'

function run (msg) {
	msg.say('Writing everyday will increase your creativity.  Write a 50 word story and I will keep track of the amount of words you use when you enter the message.')
		.route('write_response', { count: 0 })
}

function response (msg, state) {
	// Count words for given msg and update state with count
	var split_message = msg.body.event.text.split(' ')
	var message_count = split_message.length
	var count = state.count + message_count
	state.count = count
	// If count is less than 50, prompt the user and continue back to response
	if (count < 50)
	{
		var words_left = 50 - count
		msg.say('Still a little more, ' + words_left + ' words to go.')
			.route('write_response', state)
	}
	// If count is greater than 50, prompt the user and end the game
	else if (count >= 50)
	{
		msg.say('Excellent, now tell me how you feel about this short story.')
			.route('write_end')
	}
}

function end (msg) {
	msg('Thanks')
}

module.exports = {
	run: run,
	response: response,
	end: end
}
