const  IncomingWebhook = require('@slack/client').IncomingWebhook

module.exports.slack = function(message) {
  let webhook = new IncomingWebhook(process.env.SLACK_URL)
  return new Promise((resolve, reject) => {
    webhook.send(message, function(err, res) {
      if (err) return reject(err)
      resolve('ok')
    })
  })
}
