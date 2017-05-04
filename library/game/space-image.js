'use strict'

function run (db, msg) {
	// Pull from database space images and captions
    db.getRandomSpaceImage((err, spaceImage) => {
        if (err) {
          console.error(err)
        }
        // Setup the attachment for the response
        msg.say({
          text: '',
          "attachments": [
            {
                "fallback": spaceImage.title,
                "color": "#36a64f",
                "pretext": "Here is an image of something in space.  Tell me some words or phrases that come to mind when you look at this picture?",
                "author_name": "",
                "author_link": "http://flickr.com/bobby/",
                "author_icon": "http://flickr.com/icons/bobby.jpg",
                "title": spaceImage.title,
                "title_link": "",
                "text": spaceImage.text,
                "image_url": spaceImage.image,
                "thumb_url": spaceImage.image,
                "callback_id": 'nextcancel_callback',
                actions: [
                    { name: 'answer', text: 'Next', type: 'button', value: 'next' },
                    { name: 'answer', text: 'Cancel', type: 'button', value: 'cancel' },
                ]
            }
          ]
        })
        .route('space_response')
    })
}

module.exports = {
	run: run
}
