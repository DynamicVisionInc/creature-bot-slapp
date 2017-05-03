'use strict'

// const express = require('express')
// const Slapp = require('slapp')
// const ConvoStore = require('slapp-convo-beepboop')
// const Context = require('slapp-context-beepboop')

const App = require('./library/')
const express = require('express')
const PORT = process.env.PORT || 3000


var Application = express()

App(express()).listen(PORT, (err) => {
  if (err) {
    return console.error(err)
  }

  console.log('http server started on port %s', PORT)
})


Application.get('/main', function (req, res) {
	res.send('Hello World')
})

