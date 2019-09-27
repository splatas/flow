const crypto = require('crypto')
const got = require('got')

const cors = require('./cors')
const jwt = require('./jwt')
const errorHandler = require('./errorHandler')
const ResponseError = require('./ResponseError')
const openAPI = require('./openapi')

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
  const reqId = req.headers['x-request-id'] || (Date.now() + '')
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
  return ',"time":"' + (new Date()).toISOString() + '"'
}