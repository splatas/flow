const crypto = require('crypto')
const got = require('got')

const cors = require('./cors')
const jwt = require('./jwt')
const errorHandler = require('./errorHandler')
const ResponseError = require('./ResponseError')
const openAPI = require('./openapi')
const weekDays = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]
const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]

module.exports = {
  cors,
  jwt,
  md5,
  errorHandler,
  request,
  ResponseError,
  openAPI,
  genReqId,
  timestamp
}

/**
 * Request Id generator
 *
 * @param      {Object}  req     The request
 * @return     {String}  the request id
 */
function genReqId (req) {
  const reqId = Date.now()
  return reqId
}

/**
 * Hashes string with md5 algorythm
 *
 * @param      {String}  str     The string
 * @return     {String}  The md5 string hashed
 */
function md5 (str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

/**
 * Fastify request decorator
 *
 * @param      {object}  fastify  The fastify
 */
function request (fastify) {
  fastify.decorate('request', async (url, opts) => {
    const reqOpts = Object.assign({}, fastify.config.request, opts)

    fastify.log.info(`${reqOpts.method} request to ${url}`)

    return got(url, reqOpts)
  })
}

/**
 * Function used to add the ISO timestamp to request logs
 *
 * @return     {string}  the String containing the timestamp
 */
function timestamp () {
  const d = new Date()
  const zone = d.getTimezoneOffset()
  let z = 'ART'
  if (zone !== 180) {
    z = d.getTimezoneOffset() / -60.0
  }
  date = weekDays[d.getDay()] + ' '
    + months[d.getMonth()] + ' '
    + d.getHours() + ':'
    + d.getMinutes() + ':'
    + d.getSeconds() + '.'
    + d.getMilliseconds() + ' '
    + z + ' '
    + d.getFullYear()
  return ',"time":"' + date + '"'
}
