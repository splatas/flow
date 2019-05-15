const got = require('got')

const Middlewares = require('./middlewares')
const { logglyErrorHandler: erroHandler } = require('./loggly')
const hello = require('./paths/hello') // ping + now
// const list = require('./paths/list')
// const content = require('./paths/content')

module.exports = (fastify) => {
  const midds = Middlewares(fastify)
  fastify.use(midds.cors)
  fastify.decorate('bearerHandler', midds.bearerHandler)
  fastify.decorate('request', request)
  fastify.register(mount, { prefix: fastify.config.prefix })
  fastify.setErrorHandler(erroHandler)

  function request() {
    fastify.log.info('external request', ...arguments)
    return got(...arguments)
  }
}

function mount(fastify, options, next) {
  hello(fastify).definition()
  // list(fastify).definition()
  // content(fastify).definition()
  next()
}
