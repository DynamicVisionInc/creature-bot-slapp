'use strict'

const Slapp = require('slapp')
const Context = require('slapp-context-beepboop')
const ConvoStore = require('slapp-convo-beepboop')

module.exports = (server, db) => {
  let app = Slapp({
    verify_token: process.env.SLACK_VERIFY_TOKEN,
    context: Context(),
    convo_store: ConvoStore()
  })



  // Middleware
  app.use((msg, next) => {
    if (msg.body.event.user)
    {
      db.saveConvo(msg.body.event.user, msg.body, (err, convo) => {
        console.log(err)
      })
    }
    next()
  })

  var HELP_TEXT = `
  I will respond to the following messages:
  \`help\` - to see this message
  \`hi\` - to demonstrate a conversation that tracks state.
  \`thanks\` - to demonstrate a simple response.
  \`<type-any-other-text>\` - to demonstrate a random emoticon response, some of the time :wink:.
  \`attachment\` - to see a Slack attachment message.
  `

//*********************************************
// Setup different handlers for messages
//*********************************************

  app.message('store', ['mention', 'direct_message'], (msg, text, greeting) => {

    msg
      .say(`Conversation model stored!`)
      .route('store_step_2')
  })

  app.route('store_step_2', (msg, state) => {
    var text = (msg.body.event && msg.body.event.text) || ''
    msg.say(['Okay'])
  })


  app.message('test', ['direct_mention', 'direct_message'], (msg, text, greeting) => {
    msg
      .say(`How are you?`)
      .route('handleHowAreYou')  // where to route the next msg in the conversation
  })

  // register a route handler
  app.route('handleHowAreYou', (msg) => {
    // respond with a random entry from array
    msg.say(['Me too', 'Noted', 'That is interesting'])
  })



  app
    .message('motivators', ['direct_mention', 'direct_message'], (msg, text) => {

      db.getMotivations(msg.body.event.user, , (err, motivations) => {
        if (err) {
          console.error(err)
          return res.send(err)
        }
        var motivators = motivations
      })

      if (motivators)
      {
        msg
          .say('You have motivations set.')
      }
      else
      {
        msg
          .say(`What is something that motivates you to create?`)
          // sends next event from user to this route, passing along state
          .route('motivates')
      }

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
    .message(/.*/, 'mention', (msg) => {
      msg.say('You really do care about me. :heart:')
    })

    app.attachToExpress(server)








  return app
}
