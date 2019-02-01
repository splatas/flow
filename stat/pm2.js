#!/usr/bin/env node
const pack = require('../package.json')

const name = pack.name

const config = {
  apps: [
    {
      name,
      script: './server.js',
      instances: 'max',
      cwd: `/opt/nodejs/repos/${name}/current`,
      env: {
        PORT: pack['x-port'],
        LOGGER: 'yes'
      },
      env_preprod: {
        LOGGER: 'no'
      },
      env_prod: {
        LOGGER: 'no'
      }
    }
  ]
}

console.log(JSON.stringify(config, null, 2))
