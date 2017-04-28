'use strict'

function run (db, msg) {
    var color = getRandomColor()

    var color_image_url = 'https://dummyimage.com/100x100/' + color + '/' + color + '.jpg'
    msg.say('Give this color a unique name?')
      .say({
        text: '',
        "attachments": [
          {
              "fallback": color,
              "color": color,
              "pretext": '',
              "title": '',
              "title_link": '',
              "text": '',
              "image_url": color_image_url,
              "thumb_url": color_image_url,
          }
        ]
      })
      .route('color_response')
}

// Retrieve a random color
function getRandomColor () {
    var letters = '0123456789ABCDEF'
    var color = ''
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

module.exports = {
	run: run
}