const pack = require('../../package')
const EXPOSE_API = process.env.EXPOSE_API === 'yes'

module.exports = fastify => {
  fastify.register(require('fastify-swagger'), {
    exposeRoute: EXPOSE_API,
    routePrefix: '/prm/doc',
    swagger: {
      info: {
        title: 'PRM',
        description: pack.description,
        version: pack.version
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Swagger info here'
      },
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'common', description: 'Anon stat end-points' },
        { name: 'register', description: 'register device in prm service' },
        { name: 'content', description: 'content resource related endpoints' }
      ],
      securityDefinitions: {
        keyScheme: {
          description: 'authorization bearer',
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        }
      }
    }
  })
}
