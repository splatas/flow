'use strict'
const pack = require('../package.json')
const variables = require('./variables')
const db = require('./database')
const env = variables.environment || 'local'
const prefix = `/${pack.config.prefix}/v1`

const activateLogs = variables.enable_logs || false
const activateLoggly = variables.enable_loggly || false
const port = variables.port || 8100

const TWO_MONTHS = 60 * 60 * 24 * 30 * 2 // secs * min * hrs * days * months

const minervaHost = variables.minerva_host || 'geo.mnedge.cvattv.com.ar'
const config = {
  prefix,
  port,
  pino: {
    level: 'info',
    timestamp: () => ',"time":"' + (new Date()).toISOString() + '"'
  },
  jwt: {
    secret: variables.JWT_SECRET || 'luego veremos algo mejor 201807',
    exp: TWO_MONTHS,
    sign: {
      expiresIn: TWO_MONTHS
    }
  },
  externals: {
    url: `http://${minervaHost}:7780/xtv-ws-client/api`,
    accountType: 'cva'
  },
  schemes: ['https'],
  database: db[env]
}

const loggly = {
  token: '2c52ac24-4b71-40fd-975b-4f31b92c0546',
  tags: ['backend', env, 'retail'],
  json: false,
  returnStream: activateLogs,
  level: activateLogs ? 'debug' : 'error'
}

const hosts = {
  local: 'localhost:' + port,
  docker: 'localhost:' + port,
  develop: 'gw-ff-dev.cablevisionflow.com.ar',
  staging: 'gw-ff-stg.cablevisionflow.com.ar',
  preprod: 'web-prepro.flow.com.ar',
  prod: 'web.flow.com.ar'
}
config.host = hosts[env]

if (env === 'local' || env === 'docker') {
  config.schemes = ['http']
}
if (env === 'prod' && activateLoggly) {
  config.loggly = loggly
}

if (env === 'preprod' && activateLoggly) {
  config.loggly = loggly
}

module.exports = config
