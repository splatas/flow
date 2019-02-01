#!/usr/bin/env node

const pack = require('./package.json')

const fastify = require('fastify')({
  logger: process.env.LOGGER !== 'no'
})

require('./src/app')(fastify)

fastify.listen(process.env.PORT || pack['x-port'], '0.0.0.0')
