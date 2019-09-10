#!/usr/bin/env node

const { exec } = require('child_process')

const branch = process.env.DEPLOY_BRANCH || 'develop'
const env = process.env.NODE_ENV || 'local'
const command = `git log ${branch} -1 --pretty=format:"%h"`

const schemes = ['https']
let host = 'localhost:' + (process.env.PORT || '8088')
switch (env) {
  case 'local':
    schemes[0] = 'http'
    break
  case 'develop':
    host = 'gw-ff-dev.cablevisionflow.com.ar'
    break
  case 'staging':
    host = 'web-ff-stg.cablevisionflow.com.ar'
    break
  case 'preprod':
    host = 'web-prepro.flow.com.ar'
    break
  case 'prod':
    host = 'web.flow.com.ar'
    break
}

const { app } = require('./src/app')
Promise.all([execProm(command), app()])
  .then(([{ stdout, }, fastify]) => {
    // const { stdout } = await execProm(cmd)
    // const fastify = await app()
    const doc = fastify.oas()
    const out = stdout[0].trim() || ''
    doc.host = host
    doc.schemes = schemes
    doc['x-git-version'] = `${branch}_${out}`
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(doc, null, 2))
  })

function execProm(cmd) {
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
