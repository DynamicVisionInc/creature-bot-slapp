'use strict'

const Https = require('https')
const ParseString = require('xml2js').praseString

function run (msg, text) {
	msg.say('Lets play a word association game, tell me a word first.')
		.route('deviantart_response')
}

function DeviantArtResponse (msg) {
	// Make ajax request to deviant art random url
	var text = (msg.body.event && msg.body.event.text) || ''
	var url = 'https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?'
	console.log(url)
	Https.get(url, function(res) {
		res.setEncoding('utf8');
		let raw_data = '';
		res.on('data', (chunk) => { raw_data += chunk; });
		console.log('Here is raw data')
		console.log(raw_data)
		res.on('end', () => {
			try {
				console.log(raw_data)
				ParseString(raw_data, function (err, result) {
					console.log(result)
				})
				// var parser = new DOMParser();
				// var xml_doc = parser.paserFromString(raw_data, 'text/xml')

				// console.log(xml_doc)

				// const parsed_data = JSON.parse(raw_data);
				// var page_id = Object.keys(parsed_data.query.pages)[0]
				// var title = parsed_data.query.pages[page_id].title
				// var extract = parsed_data.query.pages[page_id].extract
				// msg.say({
				// 	text: 'Tell me what you think of this random Wikipedia article:',
				// 		'attachments': [
				// 		{
				// 			"fallback": '',
				// 			"color": '',
				// 			"pretext": '',
				// 			"title": title,
				// 			"title_link": 'https://en.wikipedia.org/wiki?curid=' + page_id,
				// 			"text": extract.replace(/<(?:.|\n)*?>/gm, ''),
				// 		}]
				// 	})
				// 	.route('wikipedia_response')
			} catch (e) {
				console.error(e.message);
			}
		});
	}).on('error', function(e) {
		console.log('Got error: ' + e.message)
	})
	// Creature-bot returns the wikipedia page url in message
}

module.exports = {
	run: run,
	DeviantArtResponse:  DeviantArtResponse
}
