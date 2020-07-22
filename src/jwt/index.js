'use strict'

const schema = require('./schema')

module.exports = async function (fastify, opts, next) {
  fastify.get('/jwt', { schema, preHandler: [fastify.authenticate], }, async (request, reply) => {
    reply.type('application/json').send(request.user)
  })
  next()
}
