const auth = require('./auth')
const sheet = require('./sheet')

auth.authorizeApp(function(auth) {
  console.log(auth)
  sheet.whatToEat(auth)
    .then(orders => {
      return sheet.updateMyOrder(auth, orders)
    }).
    then(response => {
        console.log(JSON.stringify(response, null, 2));
    })
    .catch(err => {
      console.log('error ', err)
    })
})

auth.authorizeApp(function(auth) {
  let orders = [ "Bò nướng sa tế",
  "Trứng cuộn phô mai",
  "Cải chua xào trứng",
  "Thịt kho tàu",
  "Bò xào lá giang" ]

  sheet.updateMyOrder(auth, orders)
  .then(orders => {
    console.log('ok')
  })
  .catch(err => {
    console.error('error', err)
  })
})
