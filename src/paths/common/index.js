const ping = require('./ping')
const revision = require('./revision')

module.exports = (fastify, opts, next) => {
  fastify.register(ping.handler, opts, next)
  fastify.register(revision.handler, opts, next)
}
