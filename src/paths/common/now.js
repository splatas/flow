const schema = {
  tags: ['common'],
  summary: 'Now',
  description: 'Returns timestamp',
  response: {
    200: {
      description: 'now timestamp',
      type: 'integer'
    }
  }
}

function nowHandler (fastify, opts, next) {
  fastify.get('/now', { schema }, async () => {
    return parseInt(Date.now())
  })
  next()
}

module.exports = {
  schema,
  handler: nowHandler
}
