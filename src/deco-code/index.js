'use strict'

const schema = require('./schema')
const { getCode } = require('./service')

const route = async (fastify, opts, next) => {
  fastify.get('/code', { schema }, async (request, reply) => {
    const { macAddress: mac } = request.query
    const res = await getCode(fastify, mac)

    reply
      .type('application/json')
      .send(res)
  })
  next()
}

module.exports = route
