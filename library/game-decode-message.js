'use strict'

function run (db, msg) {
  // Get one random phrase from decode-message-phrases table
  var decode_message_counter = 0
  // DecodeMessageGame.run(db, msg)
  db.getRandomDecodeMessage((err, message) => {
    if (err) {
      console.error(err)
    }
    var original_phrase = message.phrase
    var scrambled_phrase = shufflePhrase(message.phrase)
    // Scramble Message
    // Scramble phrase and present to the user
    // Route to the scramble response game
    msg.say(original_phrase)
      .say(scrambled_phrase)
  })
}

function shufflePhrase (text) {
  var words = text.split(" ")
  var result = ""

  while(word.length > 0)
  {
    if (result.length > 0) { result += " " }
    result += words.splice(Math.abs(Math.random() * (words.length - 1)), 1)
  }
  return result
}

module.exports = {
  run: run
}
