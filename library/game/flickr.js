'use strict'

const Https = require('https')
const ParseString = require('xml2js').parseString

function run (msg, text) {
	// Make ajax request to deviant art random url
	var text = (msg.body.event && msg.body.event.text) || ''
	var url = 'https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?'
	console.log(url)
	Https.get(url, function(res) {
		res.setEncoding('utf8');
		let raw_data = '';
		res.on('data', (chunk) => { raw_data += chunk; });
		res.on('end', () => {
			try {
				ParseString(raw_data, function (err, result) {
					for (var prop in result.feed.entry[0].link)
					{
						if (result.feed.entry[0].link[prop]['$'].type == 'image/jpeg')
						{
							console.log(result.feed.entry[0].link[prop]['$']['href'])
							msg.say({
								text: 'Here is a random image, type what comes to mind when you see this image.',
								"attachments": [
								{
									"fallback": '',
									"color": "#36a64f",
									"pretext": "",
									"author_name": "",
									"author_link": "http://flickr.com/bobby/",
									"author_icon": "http://flickr.com/icons/bobby.jpg",
									"title": '',
									"title_link": "",
									"text": '',
									"image_url": result.feed.entry[0].link[prop]['$']['href'],
									"thumb_url": result.feed.entry[0].link[prop]['$']['href'],
								}
								]
							})
							.route('flickr_response')
						}
					}
				})
			} catch (e) {
				console.error(e.message);
			}
		});
	}).on('error', function(e) {
		console.log('Got error: ' + e.message)
	})
}

module.exports = {
	run: run,
}
