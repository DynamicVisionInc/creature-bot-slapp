'use strict'

function run (msg) {
	msg.say({
      text: 'Here is a random image, post what comes to mind when you see this image.',
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
            "image_url": 'http://lorempixel.com/400/400/',
            "thumb_url": 'http://lorempixel.com/400/400/',
        }
      ]
    })
    .route('lorempixel_response')
}

module.exports = {
	run: run,
}
