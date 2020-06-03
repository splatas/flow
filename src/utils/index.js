const crypto = require('crypto')
const fetch = require('node-fetch')
const cors = require('./cors')
const jwt = require('./jwt')
const errorHandler = require('./errorHandler')
const ResponseError = require('./ResponseError')
const openAPI = require('./openapi')
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

module.exports = {
  cors,
  jwt,
  md5,
  errorHandler,
  request,
  requestJSON,
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
function genReqId(req) {
  const reqId = Date.now()
  return reqId
}

/**
 * Hashes string with md5 algorythm
 *
 * @param      {String}  str     The string
 * @return     {String}  The md5 string hashed
 */
function md5(str) {
  return crypto
    .createHash('md5')
    .update(str)
    .digest('hex')
}

/**
 * Fastify request decorator
 *
 * @param      {object}  fastify  The fastify
 */
function request(fastify) {
  fastify.decorate('request', async (url, opts) => {
    const reqOpts = Object.assign({}, fastify.config.request, opts)
    if (reqOpts.body && reqOpts.method.toLowerCase() === 'post') {
      /* Fetch needs the body to be stringified */
      reqOpts.body = JSON.stringify(reqOpts.body)
    }
    const hasContentType = Object.keys(reqOpts.headers).some(header => header === 'Content-Type')
    if (!hasContentType) {
      const content = { 'Content-Type': 'application/json' }
      reqOpts.headers = { ...reqOpts.headers, ...content }
    }
    fastify.log.info(`${reqOpts.method} request to ${url}`)
    const response = await fetch(url, reqOpts)
    return response.json()
  })
}

/**
 * Fastify requestJSON decorator
 *
 * @param      {object}  fastify  The fastify
 */
function requestJSON(fastify) {
  fastify.decorate('requestJSON', async (url, opts) => {
    const reqOpts = Object.assign({}, fastify.config.request, opts)
    if (reqOpts.body && reqOpts.method.toLowerCase() === 'post') {
      /* Fetch needs the body to be stringified */
      reqOpts.body = JSON.stringify(reqOpts.body)
    }
    const hasContentType = Object.keys(reqOpts.headers).some(header => header === 'Content-Type')
    if (!hasContentType) {
      const content = { 'Content-Type': 'application/json' }
      reqOpts.headers = { ...reqOpts.headers, ...content }
    }
    fastify.log.info(`${reqOpts.method} request to ${url}`)
    const response = await fetch(url, reqOpts)
    const json = await response.json()
    return json
  })
}
/**
 * Function used to add the ISO timestamp to request logs
 *
 * @return     {string}  the String containing the timestamp
 */
function timestamp() {
  const d = new Date()
  const zone = d.getTimezoneOffset()
  let z = 'ART'
  if (zone !== 180) {
    z = d.getTimezoneOffset() / -60.0
  }
  const date =
    weekDays[d.getDay()] +
    ' ' +
    months[d.getMonth()] +
    ' ' +
    zerofill(d.getHours()) +
    ':' +
    zerofill(d.getMinutes()) +
    ':' +
    zerofill(d.getSeconds()) +
    '.' +
    d.getMilliseconds() +
    ' ' +
    z +
    ' ' +
    d.getFullYear()
  return ',"time":"' + date + '"'
}

function zerofill(num) {
  if (num < 10) {
    num = '0' + num
  }
  return num
}
