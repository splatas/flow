#!/usr/bin/env node
const config = require('./src/config')
const { app, logger } = require('./src/app')

async function start () {
  try {
    const fastify = await app()
    await fastify.listen(config.port, '0.0.0.0')
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

start()
