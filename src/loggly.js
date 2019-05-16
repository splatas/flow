const got = require('got')
const pack = require('../package.json')

const env = process.env.NODE_ENV || 'local'

const api = 'http://logs-01.loggly.com/inputs/'
const token = '2c52ac24-4b71-40fd-975b-4f31b92c0546'
const tags = ['backend', pack.config.prefix, env]

const url = api + token + '/' + tags

module.exports = { log, logString, logglyErrorHandler }

function log(obj, ip = '') {
  logString(JSON.stringify(obj), ip)
}

function logString(body, ip = '') {
  const headers = {}
  if (ip) {
    headers['X-Forwarded-For'] = ip
  }
  got(url, { headers, body, throwHttpErrors: false })
}

function logglyErrorHandler(error, request, reply, send = true) {
  error.xTrackId = request.headers['x-request-id']
  request.log.error(error)

  const inputError = JSON.parse(JSON.stringify(error, null, 4))
  let msg = ''

  if (inputError.validation) {
    msg += inputError.validation[0].message + '. ' + inputError.validation[0].params.allowedValues.join(', ')
  }

  const toLog = {
    error: error.statusMessage || error.name,
    statusMessage: error.statusMessage || error.message,
    code: error.code,
    statusCode: error.statusCode || reply.res.statusCode,
    externalError: error.externalError,
    externalCode: error.externalCode,
    body: error.body || msg,
    xTrackId: error.xTrackId || '',
  }

  if (send) {
    reply.send(toLog)
  }
  log(toLog, request.ip)
}
