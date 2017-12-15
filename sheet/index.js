const google = require('googleapis')
const googleAuth = require('google-auth-library')
const _  = require('lodash')
const sheets = google.sheets('v4')

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
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: process.env.SHEET_ID,
      range: `Order!${SHEET_DAY_COLUMNS.MON}${DATA_META.START_ROW}:${SHEET_DAY_COLUMNS.FRI}${DATA_META.END_ROW}`,
    }, function(err, response) {
      if(err) {
        console.log('The API returned an error: ' + err)
        return reject(err)
      } else {
        let rows = response.values
        if (rows.length == 0) {
          console.log('No data found.')
          reject(new Error('No data found'))
        } else {
          resolve(computeWholeWeekOrder(rows))
        }
      }
    })
  })
}


/**
{"spreadsheetId": "1zyDPbJW_uiBtyrcW76emImzcgTu9ZJQxf9g60WhZuqE",
      "range": "Order!C10:G10",
      "includeValuesInResponse": "true",
      "responseDateTimeRenderOption": "FORMATTED_STRING",
      "responseValueRenderOption": "FORMATTED_VALUE",
      "valueInputOption": "RAW",
      "resource": {
        "values": [
          [
            "Bò nướng sa tế",
            "Trứng cuộn phô mai",
            "Cải chua xào trứng",
            "Thịt kho tàu",
            "Bò xào lá giang"
          ]
        ]
      }
    }
**/

/**
  @orders: List of order for whole week returned from `#computeWholeWeekOrder`
**/
exports.updateMyOrder = function(auth, orders) {
  const request = {
    // The ID of the spreadsheet to update.
    spreadsheetId: process.env.SHEET_ID,
    range: 'Order!C10:G10',
    includeValuesInResponse: 'true',
    responseDateTimeRenderOption: 'FORMATTED_STRING',
    responseValueRenderOption: 'FORMATTED_VALUE',
    valueInputOption: 'RAW',
    resource: {
      values: [orders]
    },
    auth: auth
  };
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.update(request, function(err, response) {
      if (err) {
        return reject(err)
      }
      resolve(response)
    })
  })
}

exports.checkMyRow = function(auth) {

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
  return new Promise((resolve, reject) => {
    let dishesStatiticsResult = []
    _.each(WEEKDAYS, function(weekDay) {
      let temp = _.map(dataSet, function(row) {
        return row[weekDay]
      })
      dishesStatiticsResult.push(computeMyOrderPerDay(temp).key)
    })
    /**
    [ 'Bò nướng sa tế',
      'Trứng cuộn phô mai',
      'Cải chua xào trứng',
      'Thịt kho tàu',
      'Bò xào lá giang' ]
    **/
    resolve(dishesStatiticsResult)
  })
}
