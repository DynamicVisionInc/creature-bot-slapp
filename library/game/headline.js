'use strict'

function run (msg) {
	var url = 'https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?'
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
							msg.say({
								text: 'Look at this image and come up with a 6 word headline that could be attributed to the image.',
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
								}]
							})
							.route('headline_response')
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

function response (msg) {
	// Count words, if not greater and or equal to six, ask again to generate a headline.
	var split_message = msg.body.event.text.split(' ')
	var message_count = split_message.length
	if (message_count >= 6)
	{
		msg.say(['Great job!', 'Good job!'])
	}
	else
	{
		msg.say('Try again, this time try to write a 6 word headline.')
			.route('headline_response')
	}
}

module.exports = {
	run: run,
	response: reponse
}
