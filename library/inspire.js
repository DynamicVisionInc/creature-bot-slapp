'use strict'

function getInspireRoute (db, msg) {
				// Get object of skills
	db.getInspireSkills(msg.body.event.user, (err, inspire_skills) => {
		if (err) {
			console.error(err)
		}

		var skills = inspire_skills
		if (!(skills instanceof Object))
		{
			// If no data exists, create object to store skills
			skills = {
				'color' : 0,
				'space' : 0
			}
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
			for (var key in skills)
			{
				if (skills.hasOwnProperty(key))
				{
					skills[key] = 0
					skills_choosen.push(key)
				}
			}
		}
		// Select randomly from array of skills not done
		var route_choosen = skills_choosen[Math.floor(Math.random() * skills_choosen.length)]

		skills[route_choosen] = 1
		// Store changes made to the skills done
		db.saveInspireSkills(msg.body.event.user, skills, (err, convo) => {
			console.log(err)
		})
		console.log(route_choosen)
		return route_choosen
	})
}

module.exports = {
	getInspireRoute: getInspireRoute
}
