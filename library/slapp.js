'use strict'

const Slapp = require('slapp')
const Context = require('slapp-context-beepboop')
const ConvoStore = require('slapp-convo-beepboop')
const Helper = require('./helper.js')
const Inspire = require('./inspire.js')

const SpaceImage = require('./game/space-image.js')
const Color = require('./game/color.js')
const DecodeMessage = require('./game/decode-message.js')
const Wikipedia = require('./game/wikipedia.js')
const Flickr = require('./game/flickr.js')
const Dream = require('./game/dream.js')
const Write = require('./game/write.js')
const Headline = require('./game/headline.js')
const Favorite = require('./game/favorite.js')

module.exports = (server, db) => {
  let app = Slapp({
    verify_token: process.env.SLACK_VERIFY_TOKEN,
    context: Context(),
    convo_store: ConvoStore()
  })


  //*********************************************
  // Middleware
  //*********************************************
  app.use((msg, next) => {
    if (msg.body.event && msg.body.event.user)
    {
      // Save message sent to Creature-bot
      db.saveConvo(msg.body.event.user, msg.body, (err, convo) => {
        if (err)
        {
          console.log(err)
        }
      })
      // Increase user experience
      db.increaseExperience(msg.body.event.user, (err) => {
        if (err)
        {
          console.log(err)
        }
      })
    }
    next()
  })

  var HELP_TEXT = `
  I will respond to the following messages:
  \`help\` - to see this message
  \`hi\` - to demonstrate a conversation that tracks state.
  \`inspire\` - invoke an inspirational game.
  \`<type-any-other-text>\` - to demonstrate a random emoticon response, some of the time :wink:.
  \`attachment\` - to see a Slack attachment message.
  `

//*********************************************
// Setup different handlers for messages
//*********************************************

  //*********************************************
  // Game Handler
  //*********************************************
  app.action('nextcancel_callback', 'answer', (msg, value) => {
    if (value === 'next')
    {
      // msg.respond(msg.body.response_url, { text:``, delete_original: true })
      // Inspire.getInspireRoute(db, msg)
    }
    else if (value === 'cancel')
    {
      // msg.respond(msg.body.response_url, { text:``, delete_original: true })
    }
  })

  //*********************************************
  // Begin Inspire Handler
  //*********************************************
  app.message('inspire', ['direct_mention', 'direct_message'], (msg, text) => {
    Inspire.getInspireRoute(db, msg)
  })
  //*********************************************
  // End Inspire Handler
  //*********************************************


  //*********************************************
  // Begin Color Name Game
  //*********************************************
  app.message('color', ['direct_mention', 'direct_message'], (msg, text) => {
    Color.run(db, msg)
  })

  app.route('color_response', (msg, state) => {
    Color.response(db, msg, state)
  })
  //*********************************************
  // End Color Name Game
  //*********************************************


  //*********************************************
  // Begin Space Image Game
  //*********************************************
  app.message('space', ['direct_mention', 'direct_message'], (msg, text) => {
    // Code used to inject space images and facts.
    // db.saveSpaceImages( {
    //   'title': "Hubble Sees a Cosmic Caterpillar",
    //   'text': 'This light-year-long knot of interstellar gas and dust resembles a caterpillar on its way to a feast.',
    //   'image': 'https://media.stsci.edu/uploads/story/display_image/1005/low_keystone.png',
    // },(err) => {
    //     if (err) {
    //       console.error(err)
    //       msg.say(err)
    //     }
    // })
    SpaceImage.run(db, msg)
  })

  app.route('space_response', (msg, state) => {
    SpaceImage.response(db, msg)
  })
  //*********************************************
  // End Space Image Game
  //*********************************************

  //*********************************************
  // Begin Decode The Message Game
  //*********************************************
  app.message('decode', ['direct_mention', 'direct_message'], (msg, text) => {
    // db.saveDecodeMessage({ 'phrase': '' })
    DecodeMessage.run(db, msg)
  })

  app.route('decode_response', (msg, state) => {
    DecodeMessage.decodeResponse(db, msg, state)
  })

  app.route('decode_end', (msg, state) => {
    msg.say(['Thanks, I have taken note.', 'Sounds good, I am keeping track of these.', 'Thanks, keep up the good work.'])
  })
  //*********************************************
  // End Decode The Message Game
  //*********************************************

  //*********************************************
  // Begin Random Wikipedia Game
  //*********************************************
  app.message('wikipedia', ['direct_mention', 'direct_message'], (msg, text) => {
    Wikipedia.run(msg)
  })

  app.route('wikipedia_response', (msg, state) => {
    Wikipedia.response(db, msg)
  })
  //*********************************************
  // End Random Wikipedia Game
  //*********************************************

  //*********************************************
  // Begin Flickr Game
  //*********************************************
  app.message('flickr', ['direct_mention', 'direct_message'], (msg, text) => {
    Flickr.run(msg)
  })

  app.route('flickr_response', (msg, state) => {
    Flickr.response(db, msg, state)
  })
  //*********************************************
  // End Flcikr Game
  //*********************************************

  //*********************************************
  // Begin Dream Game
  //*********************************************
  app.message('dream', ['direct_mention', 'direct_message'], (msg, text) => {
    Dream.run(msg)
  })

  app.route('dream_response', (msg, state) => {
    Dream.response(db, msg, state)
  })
  //*********************************************
  // End Dream Game
  //*********************************************


  //*********************************************
  // Begin Writing Game
  //*********************************************
  app.message('write', ['direct_mention', 'direct_message'], (msg, text) => {
    Write.run(msg)
  })

  app.route('write_response', (msg, state) => {
    Write.response(msg, state)
  })

  app.route('write_end', (msg, state) => {
    Write.end(msg)
  })
  //*********************************************
  // End Writing Game
  //*********************************************

  //*********************************************
  // Begin Headline Game
  //*********************************************
  app.message('headline', ['direct_mention', 'direct_message'], (msg, text) => {
    Headline.run(msg)
  })

  app.route('headline_response', (msg, state) => {
    Headline.response(msg, state)
  })

  //*********************************************
  // End Headline Game
  //*********************************************

  //*********************************************
  // Begin Favorites Game
  //*********************************************
  app.message('favorite', ['direct_mention', 'direct_message'], (msg, text) => {
    // db.saveFavorite( 'Movie' ,(err) => {})
    Favorite.run(db, msg)
  })

  app.route('favorite_response', (msg, state) => {
    Favorite.response(db, msg, state)
  })

  //*********************************************
  // End Favorites Game
  //*********************************************

  app
    .message('motivators', ['direct_mention', 'direct_message'], (msg, text) => {

      var motivators

      db.getMotivations(msg.body.event.user, (err, motivations) => {
        if (err) {
          console.error(err)
        }

        motivators = motivations
        if (motivators instanceof Object)
        {
          msg
            .say('You have motivations set.')
            .say(`Do more of this: `+motivators.motivates+'. Do less of this: '+motivators.discourages)
        }
        else
        {
          msg
            .say(`What is something that motivates you to create?`)
            // sends next event from user to this route, passing along state
            .route('motivates')
        }
      })
    })
  app.route('motivates', (msg, state) => {
      var text = (msg.body.event && msg.body.event.text) || ''

      // user may not have typed text as their next action, ask again and re-route
      if (!text) {
        return msg
          .say("Whoops, I'm still waiting to hear a response.")
          .say('What is something that motivates you to create?')
          .route('motivates', state)
      }

      // add their response to state
      state.motivates = text

      msg
        .say(`Ok. And what's something that discourages you from creating?`)
        .route('discourages', state)
    })
  app.route('discourages', (msg, state) => {
      var text = (msg.body.event && msg.body.event.text) || ''

      // user may not have typed text as their next action, ask again and re-route
      if (!text) {
        return msg
          .say("I'm eagerly awaiting to hear something that discourages you from creating.")
          .route('discourages', state)
      }

      // add their response to state
      state.discourages = text

      // Store the responses
      db.saveMotivations(msg.body.event.user, { 'motivates' : state.motivates , 'discourages' : state.discourages }, (err, convo) => {
        console.log(err)
      })

      msg
        .say('Thanks for sharing.')
        .say(`Do more of this: `+state.motivates+'. Do less of this: '+state.discourages)
      // At this point, since we don't route anywhere, the "conversation" is over
    })


  // response to the user typing "help"
  app.message('help', ['mention', 'direct_message'], (msg) => {
    msg.say(HELP_TEXT)
  })

  // Test response for boxes
  app.message('yesno', (msg) => {
    msg.say({
      text: '',
      attachments: [
        {
          text: '',
          fallback: 'Yes or No?',
          callback_id: 'yesno_callback',
          actions: [
            { name: 'answer', text: 'Yes', type: 'button', value: 'yes' },
            { name: 'answer', text: 'No',  type: 'button',  value: 'no' }
          ]
        }]
      })
  })

  app.action('yesno_callback', 'answer', (msg, value) => {
    msg.respond(msg.body.response_url, `${value} is a good choice!`)
  })


  // if a user says "do it" in a DM
  app.message('do it', ['mention', 'direct_message'], (msg) => {
    var state = { requested: Date.now() }
    // respond with an interactive message with buttons Yes and No
    msg
    .say({
      text: '',
      attachments: [
        {
          text: 'Are you sure?',
          fallback: 'Are you sure?',
          callback_id: 'doit_confirm_callback',
          actions: [
            { name: 'answer', text: 'Yes', type: 'button', value: 'yes' },
            { name: 'answer', text: 'No', type: 'button', value: 'no' }
          ]
        }]
      })
    // handle the response with this route passing state
    // and expiring the conversation after 60 seconds
    .route('handleDoitConfirmation', state, 60)
  })

  app.route('handleDoitConfirmation', (msg, state) => {
    // if they respond with anything other than a button selection,
    // get them back on track
    if (msg.type !== 'action') {
      msg
        .say('Please choose a Yes or No button :wink:')
        // notice we have to declare the next route to handle the response
        // every time. Pass along the state and expire the conversation
        // 60 seconds from now.
        .route('handleDoitConfirmation', state, 60)
      return
    }

    let answer = msg.body.actions[0].value
    if (answer !== 'yes') {
      // the answer was not affirmative
      msg.respond(msg.body.response_url, {
        text: `OK, not doing it. Whew that was close :cold_sweat:`,
        delete_original: true
      })
      // notice we did NOT specify a route because the conversation is over
      return
    }

    // use the state that's been passed through the flow to figure out the
    // elapsed time
    var elapsed = (Date.now() - state.requested)/1000
    msg.respond(msg.body.response_url, {
      text: `You requested me to do it ${elapsed} seconds ago`,
      delete_original: true
    })

    // simulate doing some work and send a confirmation.
    setTimeout(() => {
      msg.say('I "did it"')
    }, 3000)
  })



  // "Conversation" flow that tracks state - kicks off when user says hi, hello or hey
  app
    .message('^(hi|hello|hey)$', ['direct_mention', 'direct_message'], (msg, text) => {
      msg
        .say(`${text}, how are you?`)
        // sends next event from user to this route, passing along state
        .route('how-are-you', { greeting: text })
    })
    .route('how-are-you', (msg, state) => {
      var text = (msg.body.event && msg.body.event.text) || ''

      // user may not have typed text as their next action, ask again and re-route
      if (!text) {
        return msg
          .say("Whoops, I'm still waiting to hear how you're doing.")
          .say('How are you?')
          .route('how-are-you', state)
      }

      // add their response to state
      state.status = text

      msg
        .say(`Ok then. What's your favorite color?`)
        .route('color', state)
    })
    .route('color', (msg, state) => {
      var text = (msg.body.event && msg.body.event.text) || ''

      // user may not have typed text as their next action, ask again and re-route
      if (!text) {
        return msg
          .say("I'm eagerly awaiting to hear your favorite color.")
          .route('color', state)
      }

      // add their response to state
      state.color = text

      msg
        .say('Thanks for sharing.')
        .say(`Here's what you've told me so far: \`\`\`${JSON.stringify(state)}\`\`\``)
      // At this point, since we don't route anywhere, the "conversation" is over
    })

  // Can use a regex as well
  app.message(/^(thanks|thank you)/i, ['mention', 'direct_message'], (msg) => {
    // You can provide a list of responses, and a random one will be chosen
    // You can also include slack emoji in your responses
    msg.say([
      "You're welcome :smile:",
      'You bet',
      ':+1: Of course',
      'Anytime :sun_with_face: :full_moon_with_face:'
    ])
  })

  // demonstrate returning an attachment...
  app.message('attachment', ['mention', 'direct_message'], (msg) => {
    msg.say({
      text: 'Check out this amazing attachment! :confetti_ball: ',
      attachments: [{
        text: 'Slapp is a robust open source library that sits on top of the Slack APIs',
        title: 'Slapp Library - Open Source',
        image_url: 'https://storage.googleapis.com/beepboophq/_assets/bot-1.22f6fb.png',
        title_link: 'https://beepboophq.com/',
        color: '#7CD197'
      }]
    })
  })

  // response to the user asking "how did you get here?"
  app.message('how did you get here?', ['mention', 'direct_message'], (msg) => {
    msg.say('Team Rocket! :rocket:')
  })

  // "Creative motivators" flow


  app
    .message('^(hi|hello|hey)$', ['direct_mention', 'direct_message'], (msg, text) => {
      msg
        .say(text + ', how are you?')
        .route('how-are-you', { text }, 60)
    })
    .route('how-are-you', (msg, state) => {
      var resp = msg.body.event && msg.body.event.text

      if (/good/i.test(resp)) {
        msg
          .say(['Great! Ready?', ':smile: Are you sure?'])
          .route('how-are-you', state, 60)
      } else {
        msg
          .say('Me too', () => msg.say(`Thanks for saying ${state.text}`))
      }
    })
    .message('^(thanks|thank you)', ['mention', 'direct_message'], (msg) => {
      msg.say(["You're welcome", 'Of course'])
    })
    .message('help', ['direct_message', 'direct_mention'], (msg) => {
      let help = `I will respond to the following messages:
\`@slapp hi||hello\` for a greeting.
\`mention me by name in a message\` to demonstrate detecting a mention.
\`@slapp help\` to see this again.`

      msg.say(help)
    })
    .message('fix it', 'ambient', (msg) => {
      msg.say('https://www.youtube.com/watch?v=yo3uxqwTxk0')
    })
    // .message(/.*/, 'mention', (msg) => {
    //   msg.say('You really do care about me. :heart:')
    // })

    app.attachToExpress(server)

  return app
}
