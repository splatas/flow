const ping = require('./ping')
const revision = require('./revision')
const myip = require('./myip.js')

module.exports = (fastify, opts, next) => {
  fastify.register(ping.handler, opts, next)
  fastify.register(revision.handler, opts, next)
  fastify.register(myip.handler, opts, next)
}
