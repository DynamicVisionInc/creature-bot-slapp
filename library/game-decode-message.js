'use strict'

function run (db, msg) {
  // Get one random phrase from decode-message-phrases table
  db.getRandomDecodeMessage((err, message) => {
    if (err) {
      console.error(err)
    }
    var original_phrase = message.phrase
    // Scramble phrase
    var scrambled_phrase = shufflePhrase(message.phrase)
    // Send attachement and route to the scramble response game
    msg.say('Attempt to unshuffle this phrase.')
      .say({
        text: '',
        "attachments": [
          {
              "fallback": scrambled_phrase,
              "color": '',
              "pretext": '',
              "title": '',
              "title_link": '',
              "text": scrambled_phrase,
          }
        ]
      })
      .route('decode_response', { 'original_phrase': original_phrase, 'scrambled_phrase': scrambled_phrase, 'round': 0 })
  })
}

function decodeResponse (db, msg, state) {
  // Compare response to the original phrase
  // Generate a copy of the phrase but with the matching words bolded
  // Return to the user if not correct phrase with bolded phrase
  // If phrase is correct, congratulate the user and ask them to respond to Creature-bot with some words that come to mind when seeing the phrase
  msg.say('*' + state.original_phrase + '*')
    .say(state.scrambled_phrase)
}

function shufflePhrase (text) {
  var words = text.split(" ")
  var result = ""

  while(words.length > 0)
  {
    if (result.length > 0) { result += " " }
    result += words.splice(Math.abs(Math.random() * (words.length - 1)), 1)
  }
  return result
}

module.exports = {
  run: run,
  decodeResponse: decodeResponse
}
