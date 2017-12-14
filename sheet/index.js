const google = require('googleapis')
const googleAuth = require('google-auth-library')
const _  = require('lodash')

const SHEET_DAY_COLUMNS = {
  MON: 'C',
  TUE: 'D',
  WED: 'E',
  THU: 'F',
  FRI: 'G'
}

const WEEKDAYS = {
  MON: 0,
  TUE: 1,
  WED: 2,
  THU: 3,
  FRI: 4
}

const DATA_META = {
  START_ROW: 18,
  END_ROW: 69
}

exports.whatToEat = function(auth) {
  let sheets = google.sheets('v4')
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: process.env.SHEET_ID,
    range: `Order!${SHEET_DAY_COLUMNS.MON}${DATA_META.START_ROW}:${SHEET_DAY_COLUMNS.FRI}${DATA_META.END_ROW}`,
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err)
      return
    }
    let rows = response.values
    if (rows.length == 0) {
      console.log('No data found.')
    } else {
      console.log(computeWholeWeekOrder(rows))
    }
  })
}

// Let the crowd decide what is the best to have for lunch next week
const computeMyOrderPerDay = function(perDayOrders) {
  const utils = require('../utils')
  // remove undefined item for empty order
  _.remove(perDayOrders, _.isUndefined)
  // remove invalid empty + EMS orders -_-
  _.remove(perDayOrders, function(item) {
    return item === 'EMS' || item == ''
  })

  return _.last(_.sortBy(utils.flattenToArray(_.countBy(perDayOrders)), 'val'))
}

const computeWholeWeekOrder = function(dataSet) {
  let dishesStatiticsResult = {}
  _.each(WEEKDAYS, function(weekDay) {
    let temp = _.map(dataSet, function(row) {
      return row[weekDay]
    })
    dishesStatiticsResult[`${weekDay}`]  = computeMyOrderPerDay(temp)
  })

  /**
  { '0': { key: 'Bò nướng sa tế', val: 12 },
  '1': { key: 'Trứng cuộn phô mai', val: 17 },
  '2': { key: 'Cải chua xào trứng', val: 11 },
  '3': { key: 'Thịt kho tàu', val: 12 },
  '4': { key: 'Bò xào lá giang', val: 12 } }
  **/
  return dishesStatiticsResult
}
