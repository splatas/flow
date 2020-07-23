'use strict'

const schema = require('./schema')
const pkg = require('../../static/revision.json')

module.exports = async function (fastify, opts, next) {
  fastify.get('/revision', { schema }, async (request, reply) => {
    return reply.type('application/json').send(pkg)
  })
  next()
}
