'use strict'

const Helper = require('../helper.js')

var max_words = 25

function run (msg) {
	msg.say({
		text: '',
		attachments: [
		{
			text : 'Writing everyday will increase your creativity.  Write a 25 word story and I will keep track of the amount of words you use when you enter the message.',
			callback_id: 'nextcancel_callback',
			actions: [
				{ name: 'answer', text: 'Next', type: 'button', value: 'next' },
				{ name: 'answer', text: 'Cancel', type: 'button', value: 'cancel' },
			]
		}]
	})
		.route('write_response', { count: 0 }, 60)
}

function response (msg, state) {
	var message = Helper.returnMessageFromMsg(msg)

	if (message)
	{
		// Count words for given msg and update state with count
		var split_message = msg.body.event.text.split(' ')
		var message_count = split_message.length
		var count = state.count + message_count
		state.count = count
		// If count is less than max words, prompt the user and continue back to response
		if (count < max_words)
		{
			var words_left = max_words - count
			msg.say('Still a little more, ' + words_left + ' words to go.')
				.route('write_response', state)
		}
		// If count is greater than max words, prompt the user and end the game
		else if (count >= max_words)
		{
			msg.say('Excellent, now tell me what you think about this short story.')
				.route('write_end')
		}
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
