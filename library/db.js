'use strict'

const firebase = require('firebase-admin')

module.exports = () => {

  const firebaseDBUrl = process.env.FIREBASE_DB_URL
  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64

  firebase.initializeApp({
    credential: firebase.credential.cert(b64ToObject(serviceAccountBase64)),
    databaseURL: firebaseDBUrl
  })

  let database = firebase.database()

  return {
    // Team CRUD
    saveTeam (id, data, done) {
      database.ref(`teams/${id}`).set(data, (err) => {
        if (err) {
          return done(err)
        }

        return done(null)
      })
    },

    getTeam (id, done) {
      database.ref(`teams/${id}`).once('value', (snapshot) => {
        done(null, snapshot.val())
      }, done)
    },

    // Conversation CRUD
    saveConvo (id, data, done) {
      database.ref(`conversations/${id}`).push(data, (err) => {
        if (err) {
          return done(err)
        }

        return done(null)
      })
    },

    getConvo (id, done) {
      database.ref(`conversations/${id}`).once('value', (snapshot) => {
        done(null, snapshot.val())
      }, done)
    },

    deleteConvo (id, done) {
      database.ref(`conversations/${id}`).remove(done)
    },

    // Motivations CRUD
    saveMotivations (id, data, done) {
      database.ref(`motivations/${id}`).set(data, (err) => {
        if (err) {
          return done(err)
        }

        return done(null)
      })
    },

    getMotivations (id, done) {
      database.ref(`motivations/${id}`).once('value', (snapshot) => {
        done(null, snapshot.val())
      }, done)
    },

    deleteMotivations (id, done) {
      database.ref(`motivations/${id}`).remove(done)
    },

    // Experience Incrementer
    increaseExperience (id, done) {
      database.ref(`user/${id}/experience`).transaction( (current_value) => {
        return (current_value || 0) + 1
      }, done)
    },

    // Space images CRUD
    saveSpaceImages (data, done) {
      database.ref(`spaceImages/`).push(data, (err) => {
        if (err) {
          return done(err)
        }

        return done(null)
      })
    },

    getSpaceImages (done) {
      database.ref(`spaceImages/`).once('value', (snapshot) => {
        done(null, snapshot.val())
      }, done)
    },

    getRandomSpaceImage (done) {
      database.ref(`spaceImages/`).once('value', (snapshot) => {
        var i = 0;
        var rand = Math.floor(Math.random() * snapshot.numChildren());
        snapshot.forEach(function(snapshot) {
          if (i == rand) {
            done(null, snapshot.val())
          }
          i++;
        });
      }, done)
    },

    deleteSpaceImages (id, done) {
      database.ref(`spaceImages/${id}`).remove(done)
    },

    // Inspire Skills CRUD
    getInspireSkills (id, done) {
      database.ref(`inspireSkills/${id}`).once('value', (snapshot) => {
        done(null, snapshot.val())
      }, done)
    },

    saveInspireSkills (id, data, done) {
      database.ref(`inspireSkills/${id}`).set(data, (err) => {
        if (err) {
          return done(err)
        }

        return done(null)
      })
    },

    // Decode Message CRUD
    getRandomDecodeMessage (done) {
      database.ref(`decodeMessages/`).once('value', (snapshot) => {
        var i = 0;
        var rand = Math.floor(Math.random() * snapshot.numChildren());
        snapshot.forEach(function(snapshot) {
          if (i == rand) {
            done(null, snapshot.val())
          }
          i++;
        });
      }, done)
    },

    saveDecodeMessage (data, done) {
      database.ref(`decodeMessages/`).push(data, (err) => {
        if (err) {
          return done(err)
        }

        return done(null)
      })
    },

    // Dream CRUD
    saveDream (id, data, done) {
      database.ref(`dreams/${id}`).push(data, (err) => {
        if (err) {
          return done(err)
        }

        return done(null)
      })
    },

    getDream (id, done) {
      database.ref(`dreams/${id}`).once('value', (snapshot) => {
        done(null, snapshot.val())
      }, done)
    },

    deleteDream (id, done) {
      database.ref(`dreams/${id}`).remove(done)
    },


  }
}

function b64ToObject (b64) {
  return JSON.parse(b64)
  return !b64 ? {} : JSON.parse(new Buffer(b64, 'base64').toString('ascii'))
}
