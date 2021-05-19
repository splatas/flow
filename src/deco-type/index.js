'use strict'

const schema = require('./schema')
const { decoType } = require('./service')

const route = async (fastify, opts, next) => {
  fastify.get('/deco-type', { schema }, async (request, reply) => {
    const { macAddress: mac } = request.query
    const res = await decoType(fastify, mac)

    reply
      .type('application/json')
      .send(res)
  })
  next()
}

module.exports = route
