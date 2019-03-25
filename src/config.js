const pack = require('../package.json')

const env = process.env.NODE_ENV || 'local'
const prefix = `/${pack['x-prefix']}/v1`

module.exports = {
  secret: process.env.SECRET || 'luego veremos algo mejor 201807',
  prefix,
  loggly: {
    api: 'http://logs-01.loggly.com/inputs/',
    token: '2c52ac24-4b71-40fd-975b-4f31b92c0546',
    tags: 'backend,base,' + env
  }
}
