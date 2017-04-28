'use strict'

const Https = require('https')

function run (msg, text) {

}

function DeviantArtResponse (msg) {
	// Make ajax request to deviant art random url
	var url = 'http://backend.deviantart.com/rss.xml?type=deviation&q=boost%3Apopular+in%3Adigitalart%2Fdrawings+' +
	Https.get(url, function(res) {
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
						'attachments': [
						{
							"fallback": '',
							"color": '',
							"pretext": '',
							"title": title,
							"title_link": 'https://en.wikipedia.org/wiki?curid=' + page_id,
							"text": extract.replace(/<(?:.|\n)*?>/gm, ''),
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

module.exports = {
	run: run,
	DeviantArtResponse:  DeviantArtResponse
}
