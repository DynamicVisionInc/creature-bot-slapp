'use strict'

var max_words = 25

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
	if (count < max_words)
	{
		var words_left = max_words - count
		msg.say('Still a little more, ' + words_left + ' words to go.')
			.route('write_response', state)
	}
	// If count is greater than 50, prompt the user and end the game
	else if (count >= max_words)
	{
		msg.say('Excellent, now tell me what you think about this short story.')
			.route('write_end')
	}
}

function end (msg) {
	msg.say('Thanks')
}

module.exports = {
	run: run,
	response: response,
	end: end
}
