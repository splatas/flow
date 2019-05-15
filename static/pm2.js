#!/usr/bin/env node
const pack = require('../package.json')

const env = process.env['NODE_ENV'] || 'local'
const name = env + '-' + pack.config.prefix

const app = {
  name,
  script: './server.js',
  instances: 'max',
  trace: true,
  disable_trace: false,
  env: {
    PORT: pack.config.port,
    LOGGER: env === 'prod' ? 'no' : 'yes'
  }
}

if (env === 'prod') {
  app.error_file = app.out_file = '/dev/null'
}
if (env === 'preprod') {
  app.env.SECRET = 'este es otro secret para preprod 201903'
}
if (env !== 'local' && env !== 'docker') {
  app.cwd = `/opt/nodejs/repos/${name}/current`
}

// eslint-disable-next-line no-console
console.log(JSON.stringify({ apps: [ app ] }, null, 2))
