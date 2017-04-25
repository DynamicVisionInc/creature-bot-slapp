'use strict'

const Slapp = require('slapp')
const Context = require('slapp-context-beepboop')
const ConvoStore = require('slapp-convo-beepboop')
var Helper = require('./helper.js')

var inspire_routes = [
    'color_route',
    'space_route'
  ];

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
    if (msg.body.event.user)
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
  \`thanks\` - to demonstrate a simple response.
  \`<type-any-other-text>\` - to demonstrate a random emoticon response, some of the time :wink:.
  \`attachment\` - to see a Slack attachment message.
  `

//*********************************************
// Setup different handlers for messages
//*********************************************

  //*********************************************
  // Inspire Handler
  //*********************************************
  app.message('inspire', ['direct_mention', 'direct_message'], (msg, text) => {

    var skills
    // Get object of skills
    db.getInspireSkills(msg.body.event.user, (err, inspire_skills) => {
      if (err) {
        console.error(err)
      }

      skills = inspire_skills
      if (!(skills instanceof Object))
      {
        // If no data exists, create object to store skills
        skills = {
            'color' : 0,
            'space' : 0
          }
        db.saveInspireSkills(msg.body.event.user, skills, (err, convo) => {
          console.log(err)
        })
      }
      // Create array of skills not done
      var skills_choosen = []
      for (var key in skills)
      {
        if (skills.hasOwnProperty(key))
        {
          if (skills[key] == 0)
          {
            skills_choosen.push(key)
          }
        }
      }
      // Select randomly from array of skills not done
      var route_choosen = skills_choosen[Math.floor(Math.random() * skills_choosen.length)]
      skills[route_choosen] = 1

      db.saveInspireSkills(msg.body.event.user, skills, (err, convo) => {
        console.log(err)
      })
      console.log(route_choosen)
      msg.route(route_choosen + "_route")
    })


  })


  //*********************************************
  // Begin Color Name Game
  //*********************************************
  app.route('color_route', (msg, text) => {

    color = Helper.getRandomColor()

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
  })

  app.route('color_response', (msg, text) => {
    msg.say(['Thanks, I have taken note.', 'Sounds good, I am keeping track of these.', 'Thanks, keep up the good work.'])
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
    msg.route('space_route')
  })

  app.route('space_route', (msg, text) => {
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
            }
          ]
        })
        .route('space_response')
    })
  })

  app.route('space_response', (msg, state) => {
    msg.say(['Thanks, I have taken note.', 'Sounds good, I am keeping track of these.', 'Thanks, keep up the good work.'])

  })
  //*********************************************
  // End Space Image Game
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
