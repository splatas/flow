#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const framework = require('fastify')
const oas = require('fastify-oas')
const { app } = require('../src/app')
const pack = require('../package.json')

const branch = process.env.DEPLOY_BRANCH || 'develop'
const command = `git log ${branch} -1 --pretty=format:"%h"`

const openapiDoc = {
  swagger: {
    info: {
      'x-git-version': '',
      title: pack.name,
      description: pack.description,
      version: pack.version
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    schemes: ['https', 'http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'hello', description: 'Anon stat end-points' }
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
  }
}

execProm(command).then(({ stdout, stderr }) => {
  const fastify = framework()
  const revision = branch + '-' + stdout
  openapiDoc.swagger.info['x-git-version'] = revision

  fs.writeFile(path.join(__dirname, 'revision.json'), '"' + revision + '"', () => {})

  fastify.register(oas, openapiDoc)
  app(fastify)
  fastify.ready(err => {
    if (err) {
      throw err
    }
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(fastify.oas(), null, 2))
  })
})

function execProm (cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error)
        // eslint-disable-next-line no-console
        console.error(error)
        process.exit(2)
      }
      resolve({ stdout: stdout.trim().split('\n'), stderr })
    })
  })
}
