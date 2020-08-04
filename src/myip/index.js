'use strict'

const schema = require('./schema')
const getIP = require('./service')

module.exports = async function (fastify, opts, next) {
  fastify.get('/myip', { schema }, async (request, reply) => {
    const IP = await getIP(fastify.requestJSON)
    reply.type('application/json').send(IP)
  })
  next()
}
