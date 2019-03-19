#!/usr/bin/env node
const pack = require('../package.json')

const name = pack.name
const env = process.env['NODE_ENV'] || 'local'

const app = {
  name,
  script: './server.js',
  instances: 'max',
  env: {
    PORT: pack['x-port'],
    LOGGER: env === 'prod' ? 'no' : 'yes'
  }
}

if (env === 'prod') {
  app.error_file = app.out_file = '/dev/null'
}
if (env !== 'local' && env !== 'docker') {
  app.cwd = `/opt/nodejs/repos/${name}/current`
}

// eslint-disable-next-line no-console
console.log(JSON.stringify({ apps: [ app ] }, null, 2))
