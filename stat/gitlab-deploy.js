#!/usr/bin/env node

const { exec } = require('child_process');
const { name } = require('../package.json')

const refname = process.env.CI_COMMIT_REF_NAME || 'develop'

let server = 112
if (Math.random() > .5) server++

const serverIp = `10.254.244.${server}`

const cmd = `wget --header='Content-Type: application/json'`
  + ` --post-data='{"repo": "backend/'$name'", "branch": "${refname}"}'`
  + ` -qS -O- http://${serverIp}:8084/hermes/deploy`

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    return console.error(`exec error: ${error}`)
  }
  console.log(`stdout: ${stdout}`)
  console.log(`stderr: ${stderr}`)
})
