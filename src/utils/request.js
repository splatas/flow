const got = require('got')

module.exports = fastify => {
  fastify.decorate('request', async (url, opts) => {
    const reqOpts = Object.assign({}, fastify.config.request, opts)

    fastify.log.info(`${reqOpts.method} request to ${url}`)

    return got(url, reqOpts)
  })
}
