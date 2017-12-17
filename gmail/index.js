const google = require('googleapis')
const _ = require('lodash')

exports.findOrderLunchEmail = (auth) => {
  const userId = 'me'
  const query = 'subject: Order lunch for'
  return new Promise((resolve, reject) => {
    google.gmail('v1').users.messages.list({
      auth: auth,
      'userId': userId,
      'query': query,
      'q': query,
      'maxResults': 10
    }, (err, response) => {
      if (err) return reject(err)
      resolve(_.first(response.messages))
    })
  })
}

exports.readEmailContent = (auth, emailId) => {
  return new Promise((resolve, reject) => {
    google.gmail('v1').users.messages.get({
      auth: auth,
      userId: 'me',
      id: emailId,
      format: 'minimal',
      metadataHeaders: null
    }, (err, response) => {
      if (err) return reject(err)
      resolve(response)
    })
  })
}
