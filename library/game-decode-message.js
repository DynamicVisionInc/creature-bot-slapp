'use strict'

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
    msg.say('Attempt to unshuffle this phrase, you get 3 trys.  I will help you along the way.')
      .say({
        text: '',
        "attachments": [
          {
              "fallback": shuffled_phrase,
              "color": '',
              "pretext": '',
              "title": '',
              "title_link": '',
              "text": shuffled_phrase,
          }
        ]
      })
      .route('decode_response', { 'original_phrase': original_phrase, 'shuffled_phrase': shuffled_phrase, 'round': 0 })
  })
}

function decodeResponse (db, msg, state) {
  // Compare response to the original phrase
  // Generate a copy of the phrase but with the matching words bolded
  var compared = comparePhrases(state)
  // Round continues
  if (compared.correct_count != compared.possible && state.round <= 3)
  {
    // Increase round by 1
    state.round ++
    // Return to the user if not correct phrase with bolded phrase and amount of rounds left
    msg.say('You got ' + compared.correct_count + ' of ' + compared.possible + ' correct.  I have bolded the words you positioned correctly')
      .say(compared.markup_phrase)
      .route('decode_response')

  }
  // Game ends with phrase not being correct
  else if (compared.correct_count != compared.possible && state.round > 3)
  {
    msg.say('Oops, looks like you were not able to unshuffle the phrase.')
      .say('The phrase is:')
      .say(state.original_phrase)
      .say('Please tell me, how does this phrase make you feel?')
      .route('decode_end')
  }
  // Game ends with phrase being correct
  else
  {
    // If phrase is correct, congratulate the user and ask them to respond to Creature-bot
    // with some words that come to mind when seeing the phrase
    msg.say('You got it correct!')
      .say('Please tell me, how does this phrase make you feel?')
      .route('decode_end')
  }
}

function comparePhrases (state) {
  var correct_count = 0
  var possible = state.original_phrase.length
  var markup_phrase = ''
  var split_original = state.original_phrase.split(' ')
  var split_shuffle = state.shuffled_phrase.split(' ')
  for (var i = 0; i < possible; i++)
  {
    // Strict comparison of string values, lower cased, for same possition of the shuffle
    if ( split_original[i].toUpperCase() === split_shuffle[i].toUpperCase() )
    {
      correct_count ++
      markup_phrase += '*' + split_shuffle[i] + '* '
    }
    else
    {
      markup_phrase += split_shuffle[i] + ' '
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
  return result
}

module.exports = {
  run: run,
  decodeResponse: decodeResponse
}
