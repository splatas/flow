'use strict'
const fetch = require('node-fetch')
const vars = require('../../config/variables')
const env = vars.enviroment || 'local'

const api = 'http://logs-01.loggly.com/inputs/'
const token = '2c52ac24-4b71-40fd-975b-4f31b92c0546'
const tags = ['backend', 'prm', env]

const url = api + token + '/tag' + tags

module.exports = { log, logString }

function log(obj, ip = '') {
  logString(JSON.stringify(obj), ip)
}

function logString(body, ip = '') {
  const headers = {}
  headers['Content-Type'] = 'application/json'
  if (ip) {
    headers['X-Forwarded-For'] = ip
  }
  fetch(url, { headers, body: JSON.stringify(body) })
}
