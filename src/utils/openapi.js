const pack = require('../../package')
const EXPOSE_API = process.env.EXPOSE_API === 'yes'

module.exports = fastify => {
  fastify.register(require('fastify-oas'), {
    exposeRoute: EXPOSE_API,
    routePrefix: '/base/doc',
    swagger: {
      info: {
        title: 'Base',
        description: pack.description,
        version: pack.version
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Swagger info here'
      },
      schemes: fastify.config.schemes,
      host: fastify.config.host,
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'common', description: 'Anon stat end-points' }
      ],
      securityDefinitions: {
        keyScheme: {
          description: 'Authorization Bearer',
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        }
      }
    }
  })
}
