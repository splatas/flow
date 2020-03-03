const got = require('got')

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

function handler (fastify, opts, next) {
  fastify.get('/myip', { schema }, async (request, reply) => {
    const url = 'https://api.myip.com/?format=json'
    const ip = await got(url)
    reply.type('application/json').send(JSON.parse(ip.body).ip)
  })
  next()
}

module.exports = {
  schema,
  handler
}
