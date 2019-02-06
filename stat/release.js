#!/usr/bin/env node

const { exec: execOrig } = require('child_process')

const commands = {
  tags: 'git tag -l --sort=v:refname'
}

if (process.argv.length < 3) {
  console.log(`Usage: ${process.argv[1]} tag1 tag2`)
  process.exit(1)
}

(async () => {
  const prev = process.argv[2]
  const version = await getVersion(process.argv[3])
  console.log(prev, version)
})()

async function getVersion(param) {
  if (param) {
    return param
  }
  try {
    const { stdout: tags } = await exec(commands.tags)
    return tags.trim().split('\n').pop()
  } catch (e) {
    console.error('getVersion', e)
    process.exit(1)
  }
}

function exec(cmd) {
  return new Promise((resolve, reject) => {
    execOrig(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject({ error, stderr })
      }
      resolve({ stdout, stderr })
    })
  })
}
