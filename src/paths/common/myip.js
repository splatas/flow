const schema = {
  tags: ['common'],
  summary: 'Server Public IP',
  description: 'Server Public IP',
  response: {
    200: {
      description: 'IP',
      type: 'string'
    }
  }
}

function handler(fastify, opts, next) {
  fastify.get('/myip', { schema }, async (request, reply) => {
    const url = 'https://api.myip.com/?format=json'
    const response = await fastify.requestJSON(url)
    reply.type('application/json').send(response.ip)
  })
  next()
}

module.exports = {
  schema,
  handler
}
