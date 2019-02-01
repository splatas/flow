const v8 = require('v8')
const pack = require('../../package.json')

module.exports = (fastify) => {
  function definition() {
    fastify.get('/ping', { schema: schemaPing }, (request, reply) => {
      reply.type('application/json').send('pong')
    })

    fastify.get('/now', { schema: schemaNow }, (request, reply) => {
      reply.type('application/json').send(Date.now())
    })

    fastify.get('/totalMB', { schema: schemaTotalMB }, totalMB)
    fastify.get('/revision', { schema: schemaRevision }, revision)
  }

  const schemaNow = {
    tags: ['hello'],
    summary: 'Now',
    description: 'whats tha time?!',
    response: {
      200: {
        description: 'unix timestamp + milli',
        type: 'integer'
      }
    }
  }

  const schemaPing = {
    tags: ['hello'],
    summary: 'Ping',
    description: 'punga',
    response: {
      200: {
        description: 'pong',
        type: 'string'
      }
    }
  }

  const schemaTotalMB = {
    tags: ['hello'],
    summary: 'Memory usage',
    description: 'megabytes & ram',
    response: {
      200: {
        description: 'memory consumptions & totals',
        type: 'object',
        properties: {
          total_heap_size: { type: 'number' },
          total_heap_size_executable: { type: 'number' },
          total_physical_size: { type: 'number' },
          total_available_size: { type: 'number' },
          used_heap_size: { type: 'number' },
          heap_size_limit: { type: 'number' },
          malloced_memory: { type: 'number' },
          peak_malloced_memory: { type: 'number' },
          does_zap_garbage: { type: 'boolean' },
        }
      }
    }
  }

  const schemaRevision = {
    tags: ['hello'],
    summary: 'Revision',
    description: 'Git revision',
    response: {
      200: {
        description: 'Git revision',
        type: 'string'
      }
    }
  }

  return { 
    definition,
    schema: {
      now: schemaNow,
      ping: schemaPing,
      totalMB: schemaTotalMB,
      revision: schemaRevision,
    }
  }
}

function totalMB(req, reply) {
  const stats = v8.getHeapStatistics()
  const MB = 1048576
  const out = {}
  for (const k in stats) {
    out[k] = stats[k] / MB
  }
  reply.send(out)
}

function revision(request, reply) {
  reply.type('application/json').send(pack['x-git-version'])
}
