const pack = require('../package.json')

const env = process.env.NODE_ENV || 'local'
const prefix = `/${pack.config.prefix}/v1`

module.exports = {
  secret: process.env.SECRET || 'luego veremos algo mejor 201807',
  prefix
}
