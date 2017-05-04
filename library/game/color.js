'use strict'

const Helper = require('../helper.js')

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
          "callback_id": 'nextcancel_callback',
          actions: [
            { name: 'answer', text: 'Next', type: 'button', value: 'next' },
            { name: 'answer', text: 'Cancel', type: 'button', value: 'cancel' },
          ]
        }
      ]
    })
    .route('color_response', { 'color' : color }, 60)
}

function response (db, msg, state) {
  var user = Helper.returnUserFromMsg(msg)
  var message = Helper.returnMessageFromMsg(msg)

  if (user && message)
  {
    var color = state.color
    db.saveUserColor(user, {  name : message, color : color }, (err, convo) => {
      if (err)
      {
        console.log(err)
      }
    })
    msg.say(['Thanks, I have taken note.', 'Sounds good, I am keeping track of these.', 'Thanks, keep up the good work.'])
  }
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
	run: run,
  response: response
}
