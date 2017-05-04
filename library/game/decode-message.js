'use strict'

const Helper = require('../helper.js')

function run (db, msg) {
  // Get one random phrase from decode-message-phrases table
  db.getRandomDecodeMessage((err, message) => {
    if (err) {
      console.error(err)
    }
    var original_phrase = message.phrase
    // Scramble phrase
    var shuffled_phrase = shufflePhrase(message.phrase)
    // Send attachement and route to the scramble response game
    msg.say({
        text: 'Attempt to unshuffle this phrase, you get 3 trys.  I will help you along the way.',
        attachments: [
          {
              fallback: shuffled_phrase,
              color: '',
              pretext: '',
              title: '',
              title_link: '',
              text: shuffled_phrase,
              callback_id: 'nextcancel_callback',
              actions: [
                { name: 'answer', text: 'Next', type: 'button', value: 'next' },
                { name: 'answer', text: 'Cancel', type: 'button', value: 'cancel' },
              ]
          }
        ]
      })
      .route('decode_response', { 'original_phrase': original_phrase, 'shuffled_phrase': shuffled_phrase, 'round': 0 })
  })
}

function decodeResponse (db, msg, state) {
  var user = Helper.returnUserFromMsg(msg)
  var message = Helper.returnMessageFromMsg(msg)

  if (user && message)
  {
    // Compare response to the original phrase
    // Generate a copy of the phrase but with the matching words bolded
    var compared = comparePhrases(state, message)
    // Round continues
    if (compared.correct_count != compared.possible && state.round < 3)
    {
      // Increase round by 1
      state.round ++
      // Return to the user if not correct phrase with bolded phrase and amount of rounds left
      msg.say('Round ' + state.round + ' of 3.')
        .say('You got ' + compared.correct_count + ' of ' + compared.possible + ' correct.  I have bolded the words you positioned correctly')
        .say(compared.markup_phrase)
        .say('Try again, remember the shuffled phrase is:')
        .say(state.shuffled_phrase)
        .route('decode_response', state)

    }
    // Game ends with phrase not being correct
    else if (compared.correct_count != compared.possible && state.round >= 3)
    {
      msg.say('Oops, looks like you were not able to unshuffle the phrase.')
        .say('The phrase is:')
        .say(state.original_phrase)
        .say('Please tell me, what do you think this phrase means?')
        .route('decode_end')
    }
    // Game ends with phrase being correct
    else
    {
      // If phrase is correct, congratulate the user and ask them to respond to Creature-bot
      // with some words that come to mind when seeing the phrase
      msg.say('You got it correct!')
        .say('Please tell me, what do you think this phrase means?')
         .route('decode_end')
    }
  }
}

function comparePhrases (state, given_message) {
  var correct_count = 0
  var markup_phrase = ''
  var split_original = state.original_phrase.split(' ')
  var possible = split_original.length
  var split_given_message = given_message.split(' ')
  for (var i = 0; i < possible; i++)
  {
    if (split_given_message[i])
    {
      // Strict comparison of string values, lower cased, for same possition of the shuffle
      if ( split_original[i].toUpperCase() === split_given_message[i].toUpperCase() )
      {
        correct_count ++
        markup_phrase += '*' + split_given_message[i] + '* '
      }
      else
      {
        markup_phrase += split_given_message[i] + ' '
      }
    }
  }
  return {
    'correct_count' : correct_count,
    'possible' : possible,
    'markup_phrase' : markup_phrase
  }
}

function shufflePhrase (text) {
  var words = text.split(' ')
  var result = ''

  while(words.length > 0)
  {
    if (result.length > 0) { result += ' ' }
    result += words.splice(Math.abs(Math.random() * (words.length - 1)), 1)
  }
  if (text === result)
  {
    result = shuffle(text)
  }

  return result
}

module.exports = {
  run: run,
  decodeResponse: decodeResponse
}
