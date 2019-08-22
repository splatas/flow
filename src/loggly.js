const got = require('got')

const env = process.env.NODE_ENV || 'local'

const api = 'http://logs-01.loggly.com/inputs/'
const token = '2c52ac24-4b71-40fd-975b-4f31b92c0546'
const tags = ['backend', 'prm', env]

const url = api + token + '/tag' + tags

module.exports = { log, logString }

function log (obj, ip = '') {
  logString(JSON.stringify(obj), ip)
}

function logString (body, ip = '') {
  const headers = {}
  if (ip) {
    headers['X-Forwarded-For'] = ip
  }
  got(url, { headers, body, throwHttpErrors: false })
}
