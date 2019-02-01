#!/usr/bin/env node
const oas = require('fastify-oas')
const fastify = require('fastify')()
const pack = require('../package.json')

fastify.register(oas, {
  routePrefix: '/doc',
  exposeRoute: true,
  swagger: {
    info: {
      title: pack.name,
      description: pack.description,
      version: pack.version,
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
    schemes: ['https', 'http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'hello', description: 'Anon stat end-points' },
      // { name: 'tscreen', description: 'Multiscreen related end-points' }
    ],
    securityDefinitions: {
      keyScheme: {
        description: 'authorization bearer',
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    }
  },
})

require('../src/app')(fastify)

fastify.ready(err => {
  if (err) throw err
  console.log(JSON.stringify(fastify.oas(), null, 2))
})
