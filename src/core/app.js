'use strict'
const config = require('./config')
const { logger, ...utils } = require('../utils')

const fastify = require('fastify')({
  requestIdHeader: 'x-request-id',
  logger,
})

async function app() {
  await fastify.register(require('middie'))
  fastify.decorate('config', config)
  fastify.use(utils.cors)
  fastify.setErrorHandler(utils.errorHandler)

  utils.jwt(fastify)
  utils.request(fastify)
  utils.requestJSON(fastify)
  utils.openAPI(fastify)

  fastify.register(require('../myip'), { prefix: fastify.config.prefix })
  fastify.register(require('../revision'), { prefix: fastify.config.prefix })
  fastify.register(require('../ping'), { prefix: fastify.config.prefix })
  fastify.register(require('../jwt'), { prefix: fastify.config.prefix })

  fastify.ready(err => {
    if (err) throw err
    fastify.oas()
  })

  return fastify
}

module.exports = {
  app,
  logger: fastify.log
}
