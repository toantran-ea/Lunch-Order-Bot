const _  = require('lodash')

exports.flattenToArray = function(obj) {
  let flattenArray = []
  _.forEach(_.keys(obj), function(key) {
    flattenArray.push({
      key,
      val: obj[key]
    })
  })
  return flattenArray
}
