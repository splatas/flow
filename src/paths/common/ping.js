const schema = {
  tags: ['common'],
  summary: 'Ping',
  description: 'Returns pong',
  response: {
    200: {
      description: 'pong',
      type: 'string'
    }
  }
}

function pingHandler (fastify, opts, next) {
  fastify.get('/ping', { schema }, (request, reply) => {
    reply.type('application/json').send('pong')
  })
  next()
}

module.exports = {
  schema,
  handler: pingHandler
}
