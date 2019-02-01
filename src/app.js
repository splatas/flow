const got = require('got')

const Middlewares = require('./middlewares')
const hello = require('./paths/hello') // ping + now
// const list = require('./paths/list')
// const content = require('./paths/content')

module.exports = (fastify) => {
  const midds = Middlewares(fastify)
  fastify.use(midds.cors)
  fastify.use(midds.bearer)
  fastify.decorate('request', request)
  fastify.register(mount, { prefix: fastify.config.prefix })
  fastify.addHook('onError', fastifyError)

  function request() {
    fastify.log.info('external request', ...arguments)
    return got(...arguments)
  }

  function fastifyError(req, reply, error, next) {
    const url = fastify.config.loggly.api
      + fastify.config.loggly.token
      + '/tag/'
      + fastify.config.loggly.tags
      + '/'
    let body = error.name + ' - ' + error.message
    if (error.code) { error += ' - code: ' + error.code }
    if (error.status) { error += ' - status: ' + error.status }
    if (error.statusCode) { error += ' - statusCode: ' + error.statusCode }
    request(url, { body })
    next()
  }
}

function mount(fastify, options, next) {
  hello(fastify).definition()
  // list(fastify).definition()
  // content(fastify).definition()
  next()
}
