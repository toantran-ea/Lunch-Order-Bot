const auth = require('./auth')
const sheet = require('./sheet')
const gmail = require('./gmail')
const utils = require('./utils')
const noti = require('./notification')

auth.authorizeApp(function(auth) {
  sheet.checkMyRow(auth)
    .then(isMyNameFound => {
      console.log('there is your name!!!')
      if(isMyNameFound) {
        return sheet.whatToEat(auth)
      } else {
        throw new Error('Could not found my name in the sheet!!! Awwwwww!!!')
      }
    })
    .then(orders => {
      console.log('Here is your order >>> \n', orders)
      // return sheet.updateMyOrder(auth, orders)
    })
    .then(response => {
      console.log('All good! send you a message now!')
      return noti.slack('all good')
    })
    .catch(err => {
      console.log('error ', err)
      noti.slack(err)
    })
})

// auth.authorizeApp(auth => {
//   gmail.readEmailContent(auth, '1603549062443699')
//     .then(response => {
//       console.log('response', response)
//       console.log('id', _.first(utils.utils.extractURLs(response.snippet)))
//     })
//     .catch(err => {
//       console.error('error ', err)
//     })
// })
