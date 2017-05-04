'use strict'

function returnUserFromMsg(msg) {
	if (msg.body.event)
	{
		return msg.body.event.user
	}
	else
	{
		return msg.body.user.id
	}
}

function returnMessageFromMsg(msg) {
	if (msg.body.event && msg.body.event.text != '')
	{
		return msg.body.event.text
	}
	else
	{
		return null
	}
}

module.exports = {
	returnUserFromMsg: returnUserFromMsg,
	returnMessageFromMsg: returnMessageFromMsg
}
