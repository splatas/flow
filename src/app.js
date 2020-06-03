const config = require('./config')
const { genReqId, timestamp, ...utils } = require('./utils')

const { commonPathsRegister } = require('./paths')

const fastify = require('fastify')({
  requestIdHeader: 'x-request-id',
  genReqId,
  logger: { timestamp },
})

fastify.decorate('config', config)
fastify.use(utils.cors)
fastify.setErrorHandler(utils.errorHandler)

function app() {
  utils.jwt(fastify)
  utils.request(fastify)
  utils.requestJSON(fastify)
  utils.openAPI(fastify)

  commonPathsRegister(fastify, { prefix: fastify.config.prefix })

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
