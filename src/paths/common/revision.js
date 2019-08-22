const pkg = require('../../../package')

const schema = {
  tags: ['common'],
  summary: 'Revision',
  description: 'Returns git last hash',
  response: {
    200: {
      description: 'revision',
      type: 'string'
    }
  }
}

function revisionHandler (fastify, opts, next) {
  fastify.get('/revision', { schema }, async (request, reply) => {
    return reply.type('application/json').send(pkg['x-git-version'])
  })
  next()
}

module.exports = {
  schema,
  handler: revisionHandler
}
