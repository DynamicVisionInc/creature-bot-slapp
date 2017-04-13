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

    saveConvo (id, data, done) {
      database.ref(`convos/${id}`).set(data, (err) => {
        if (err) {
          return done(err)
        }

        return done(null)
      })
    },

    getConvo (id, done) {
      database.ref(`convos/${id}`).once('value', (snapshot) => {
        done(null, snapshot.val())
      }, done)
    },

    deleteConvo (id, done) {
      database.ref(`convos/${id}`).remove(done)
    }
  }
}

function b64ToObject (b64) {
  // {"type": "service_account","project_id": "creature-9ef38","private_key_id": "f642225fc4c2a3e97186bcb55574975704828c5e","private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC5fb+QrHoi4z1N\n95PZP8Y4MktAutPbn0a1IotUqw+BxWexP2OydQeR2gvQPYlkYffgbifRdjXMD+L5\nWJ8/VOf2/eqv1UU9ZpLdkJsAxMQaEO+EobJMoeo7ngIEgw4XH2tKDeGygavz/VKx\nALlRJ0QlyzyeiUNqz9scZFVlI7EWpXJT44+0tPpyxbfzYKcsXCqO/O4IN6LpGM1e\nr3WjZXqFuYmsNuv7La8xxFipSULLFA548Ne8g1zphn3paKDtXhHWUis/RpXLkDkl\nMB2Hw9tFNBKZC5yz2TH/ohczFtMrg0As6fbHzSxQwWOhlmm9eqg7QL35MjY7lrjV\nsNusn/dVAgMBAAECggEAIob0rJJeXbYcyDGIdMz5Maay+UaNfvkD6V2Xv9fjmA1N\nwuGAxkwgb5a90jJSK7xMrprykHvHgceHQVCsu9YrI3+aOsahD8/TEKkFITx/IDb8\nzpxmmvscpaJAz+QxMD6p8uvokhivEEicJtRyqld7yOkuzHfSc8RjDcLjXmMpaIRr\nuH/gvPJkJHhzxKTjuxgENnKaJp3ZJWEdhLl0pM3bKHiAIvO7vkuoU/dFFznUfaPm\n45budXEuClfW+THcQEzNAyWEYrC/YdXNVvsof6hJKIfD8C0uuDVWzStchj/mcnOi\n8J/ZbjOdSLllxHTz0y8Hn5DBSDxvv3/JXlhCdB1GoQKBgQD07bmJHr2hIBfN9eCj\nvzzhM6wA0JOLW69NZSGHTdZ7rJUFc2P599zUaAwyG44aK3YkBZ6DCmOryF3/693G\niHBWLR9QHtQGu+xRD6Bd0Q+9XnnzXaNJNUOhxstdSZJ8EEYY2kj7yBZLTaSY13o9\n1dFYMyD1bTBD92IJ1EWou3NArQKBgQDB4DkmsnDKBF7g1q8zloK1ZoFTxJ7UZQKG\n7KDEoYPVBIFn4d0REhTCtGgcgyKZ7zS57A3QD4l9Y8SjJ5m461asktaSg16Zqt1n\nF4tv05AcHxMBif667EX3P9LO8pg9n3HW7ClyZ4HBQRa88TYqmdnQUtLwNZiO8bjk\n2ePjzG9eSQKBgFyH3vstkOhpTnTx+g8CtYZC1i1snwEb/ytXFIagYnJQre/kOxX5\njQT11f2sKVA7sSNEuDC7YRJJ3TFNM3jInOABpf3H18Q/hLTPGX+39qFNKvdFHeYP\naGCa0MOKgvu5zjGfbckpOzrxt0hCx5zKxY7zqfTubjiPIguilTp8rrr1AoGBAIrf\nchCmAOSz/MJRBW6OgVIu+rRmQt8g+45qMT6n8ybC827V+uQfb3+Ieorx4/cfwUTs\nMXi3qGSI8nFsDFDJQmybQdfxAfJQ0gbmdprDkJaUK6kOj8iVNgjFTtuuKh759zFc\nONQaEHe9h+wPXB1n1v3CVhZ6Ta0WuLo02WhzJ9MBAoGBAMZ2cNgAsgdZDjuZFe0e\nM2CSTsRrKZ81j5Hfd1oXkcFHw5S96EU/OOg7YvmL2IrlwwgMLt2TkkexVSmCCmYI\nniVre4Jp0rn3+0ImHLBhiWGRmcPpMuOQmT+XJnquUpuxFM2u1bBxABboOmlj1j6y\nZNn+wo9l6v80hJjJ2dQMbNah\n-----END PRIVATE KEY-----\n","client_email": "firebase-adminsdk-z0twa@creature-9ef38.iam.gserviceaccount.com","client_id": "102866890180498636837","auth_uri": "https://accounts.google.com/o/oauth2/auth","token_uri": "https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-z0twa%40creature-9ef38.iam.gserviceaccount.com"}
  return JSON.parse(b64)
  return !b64 ? {} : JSON.parse(new Buffer(b64, 'base64').toString('ascii'))
}
