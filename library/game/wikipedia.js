'use strict'

const Https = require('https')
const Helper = require('../helper.js')

function run (msg) {
	// Make ajax request to wikipedia random url
	Https.get('https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exchars=500&format=json', function(res) {
		res.setEncoding('utf8');
		let raw_data = '';
		res.on('data', (chunk) => { raw_data += chunk; });
		res.on('end', () => {
			try {
				const parsed_data = JSON.parse(raw_data);
				var page_id = Object.keys(parsed_data.query.pages)[0]
				var title = parsed_data.query.pages[page_id].title
				var extract = parsed_data.query.pages[page_id].extract
				msg.say({
					text: 'Tell me what you think of this random Wikipedia article:',
					attachments: [
					{
						fallback: '',
						color: '',
						pretext: '',
						title: title,
						title_link: 'https://en.wikipedia.org/wiki?curid=' + page_id,
						text: extract.replace(/<(?:.|\n)*?>/gm, ''),
						callback_id: 'nextcancel_callback',
						actions: [
							{ name: 'answer', text: 'Next', type: 'button', value: 'next' },
							{ name: 'answer', text: 'Cancel', type: 'button', value: 'cancel' },
						]
					}]
				})
					.route('wikipedia_response')
			} catch (e) {
				console.error(e.message);
			}
		});
	}).on('error', function(e) {
		console.log('Got error: ' + e.message)
	})
	// Creature-bot returns the wikipedia page url in message
}

function response (db, msg) {
	var message = Helper.returnMessageFromMsg(msg)

	if (message)
	{
		msg.say(['Thanks, I have taken note.', 'Sounds good, I am keeping track of these.', 'Thanks, keep up the good work.'])
	}
}

module.exports = {
	run: run,
	response: response
}
