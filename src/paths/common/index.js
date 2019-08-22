const ping = require('./ping')
const now = require('./now')
const revision = require('./revision')

module.exports = (fastify, opts, next) => {
  fastify.register(ping.handler, opts, next)
  fastify.register(now.handler, opts, next)
  fastify.register(revision.handler, opts, next)
}
