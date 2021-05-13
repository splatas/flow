'use strict'
const fetch = require('node-fetch')
const variables = require('../../config/variables')
const env = variables.enviroment || 'local'

const api = 'http://logs-01.loggly.com'
const token = '2c52ac24-4b71-40fd-975b-4f31b92c0546'
const tags = ['backend', 'prm', env]

const url = api + '/inputs/' + token + '/tag' + tags

module.exports = { log, logString, api, url }

function log(obj, ip = '') {
  logString(JSON.stringify(obj), ip)
}

function logString(body, ip = '') {
  const headers = {}
  headers['Content-Type'] = 'application/json'
  if (ip) {
    headers['X-Forwarded-For'] = ip
  }
  fetch(url, { headers, method: 'POST', body: JSON.stringify(body) })
}
