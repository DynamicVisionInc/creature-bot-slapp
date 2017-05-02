'use strict'

//*********************************************
// Instantiate Inspire Game Objects
//*********************************************
const SpaceImage = require('./game/space-image.js')
const Color = require('./game/color.js')
const DecodeMessage = require('./game/decode-message.js')
const Wikipedia = require('./game/wikipedia.js')
const Flickr = require('./game/flickr.js')
const Dream = require('./game/dream.js')
const Write = require('./game/write.js')
const Headline = require('./game/headline.js')

//*********************************************
// List of Inspire routes
//*********************************************
var default_skills = {
		'color'				: 0,
		'space'				: 0,
		'decode_message' 	: 0,
		'wikipedia' 		: 0,
		'flickr'			: 0,
		'dream'				: 0,
		'write'				: 0,
		'headline'			: 0
	}

//*********************************************
// Inspire Functions
//*********************************************

function getInspireRoute (db, msg) {
	var route_choosen
	// Get object of skills and select a undone route.
	db.getInspireSkills(msg.body.event.user, (err, inspire_skills) => {
		if (err) {
			console.error(err)
		}
		var route_choosen = selectInspireSkills(db, msg, inspire_skills)
		console.log(route_choosen)
		msg.route(route_choosen + "_route")
		switch (route_choosen)
		{
			case 'space':
				SpaceImage.run(db, msg)
				break;
			case 'color':
				Color.run(db, msg)
				break;
			case 'decode_message':
				DecodeMessage.run(db, msg)
				break;
			case 'wikipedia':
				Wikipedia.run(msg)
				break;
			case 'flickr':
				Flickr.run(msg)
				break;
			case 'dream':
				Dream.run(msg)
				break;
			case 'write':
				Write.run(msg)
				break;
			case 'headline':
				Headline.run(msg)
				break;
			default:
				SpaceImage.run(db, msg)
		}
	})
}

function selectInspireSkills (db, msg, inspire_skills) {

	var skills = inspire_skills
	if (!(skills instanceof Object))
	{
		// If no data exists, create object to store skills
		skills = default_skills
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
	// If all skills have been done, loop through skills and set to undone and push all skills to skills_choosen
	if (skills_choosen.length == 0)
	{
		skills = default_skills
		for (var key in skills)
		{
			if (skills.hasOwnProperty(key))
			{
				skills_choosen.push(key)
			}
		}
	}
	// Select randomly from array of skills not done
	var route_choosen = skills_choosen[Math.floor(Math.random() * skills_choosen.length)]

	skills[route_choosen] = 1
	// Store changes made to the skills done
	db.saveInspireSkills(msg.body.event.user, skills, (err, convo) => {
		if (err) {
			console.log(err)
		}
	})

	return route_choosen
}

module.exports = {
	getInspireRoute: getInspireRoute
}
