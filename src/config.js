const pack = require('../package.json')
// const pm2Conf = require('./pm2.json').apps[0]

const env = process.env.NODE_ENV || 'local'
const prefix = `/${pack.config.prefix}/v1`


// setPm2EnvVars()

const activateLogs = process.env.ENABLE_LOGS !== 'no'
const activateLoggly = process.env.ENABLE_LOGGLY !== 'no'
const port = process.env.PORT || 8000
process.env.PROJECT = 'base'

const TWO_MONTHS = 60 * 60 * 24 * 30 * 2 // secs * min * hrs * days * months

const minervaHost = process.env.MINERVA_HOST || 'geo.mnedge.cvattv.com.ar'
const config = {
  prefix,
  port,
  pino: {
    level: 'info'
  },
  jwt: {
    secret: process.env.SECRET || 'luego veremos algo mejor 201807',
    exp: TWO_MONTHS,
    sign: {
      expiresIn: TWO_MONTHS,
    },
  },
  externals: {
    url: `http://${minervaHost}:7780/xtv-ws-client/api`,
    accountType: 'cva',
  },
  schemes: ['https']
}

const loggly = {
  token: '2c52ac24-4b71-40fd-975b-4f31b92c0546',
  tags: ['backend', env, 'auth'],
  json: false,
  returnStream: activateLogs,
  level: activateLogs ? 'debug' : 'error',
}

const hosts = {
  local: 'localhost:' + port,
  docker: 'localhost:' + port,
  develop: 'gw-ff-dev.cablevisionflow.com.ar',
  staging: 'gw-ff-stg.cablevisionflow.com.ar',
  preprod: 'web-prepro.flow.com.ar',
  prod: 'web.flow.com.ar',
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

/*
function setPm2EnvVars() {
  if (process.env.TESTING !== 'yes') {
    return false
  }
  for (const k in pm2Conf.env) {
    process.env[k] = pm2Conf.env[k]
  }
  for (const k in pm2Conf.env[env]) {
    process.env[k] = pm2Conf.env[env][k]
  }
}
*/
