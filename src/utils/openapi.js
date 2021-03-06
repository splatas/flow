'use strict'
const pack = require('../../package.json')
const variables = require('../../config/variables')
const revision = require('../../static/revision.json')
const EXPOSE_API = variables.expose_api || false

module.exports = fastify => {
  fastify.register(require('fastify-oas'), {
    exposeRoute: EXPOSE_API,
    routePrefix: '/base/doc',
    swagger: {
      info: {
        'x-git-version': revision,
        title: pack.config.fullName,
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
