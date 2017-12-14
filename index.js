const auth = require('./auth')
const sheet = require('./sheet')

auth.authorizeApp(sheet.whatToEat)
