const _  = require('lodash')
const getUrls = require('get-urls')

exports.flattenToArray = (obj) => {
  let flattenArray = []
  _.forEach(_.keys(obj), (key) => {
    flattenArray.push({
      key,
      val: obj[key]
    })
  })
  return flattenArray
}

exports.extractURLs = (snippet) => {
  return getUrls(snippet)
}

exports.extractIdFromUrl = (url) => {
  return url.match(/[-\w]{25,}/)
}
