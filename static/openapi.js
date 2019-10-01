#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const oas = require('fastify-oas')
const { app } = require('../src/app')
const pack = require('../package.json')
const config = require('../src/config.js')

const branch = process.env.DEPLOY_BRANCH || 'develop'
const command = `git log ${branch} -1 --pretty=format:"%h"`

execProm(command).then(({ stdout, stderr }) => {
  const revision = branch + '-' + stdout

  fs.writeFile(path.join(__dirname, 'revision.json'), '"' + revision + '"', () => {})

  const fastify = app()
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
