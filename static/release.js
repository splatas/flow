#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const { format } = require('util')
const { exec: execOrig } = require('child_process')
const { name, config: { fullName } } = require('../package.json')

const commands = {
  tags: 'git tag -l --sort=v:refname',
  log: 'git log %s --pretty="* %s" --abbrev-commit --reverse | sed "/^\\* [m,M]erge/d" | uniq'
}

// eslint-disable-next-line no-console
const _l = console.log.bind(console)

// eslint-disable-next-line no-console
const _e = console.error.bind(console)
if (process.argv.length < 3) {
  _l(`Usage: ${process.argv[1]} tag1 tag2`)
  process.exit(1)
}

(async () => {
  const prev = process.argv[2]
  const version = await getVersion(process.argv[3])
  const log = await exec(format(commands.log, `${prev}..${version}`))
  const file = `release_notes_${name}_${prev}_${version}.rst`
  const releasePath = path.join(__dirname, '..', 'release')
  try {
    await fs.statSync(releasePath)
  } catch (err) {
    exec(`mkdir ${releasePath}`)
  }
  await Promise.all([
    render(prev, version, name, fullName, file, log.stdout),
    exec(`cp ${__dirname}/openapi.json ${releasePath}/openapi_${name}_${version}.json`),
    exec(`cp ${__dirname}/shipitfile.js ${releasePath}/shipitfile_${name}_${version}.js`)
  ])
  _l('Generating pdf')
  const docParams = {
    channel: 'backend',
    repo: `backend/${name}`,
    to: version
  }
  const output = await exec(`curl 'http://10.200.172.71/doc/v2/upload' -X POST -H 'Content-Type: application/json'  -d '${JSON.stringify(docParams)}'`)
  console.log(`curl 'http://10.200.172.71/doc/v2/upload' -X POST -H 'Content-Type: application/json'  -d '${JSON.stringify(docParams)}'`)
  console.log(output)
})()

async function getVersion(param) {
  if (param) {
    return param
  }
  try {
    const { stdout: tags } = await exec(commands.tags)
    return tags.pop()
  } catch (e) {
    _e('getVersion', e)
    process.exit(1)
  }
}

function exec(cmd) {
  return new Promise((resolve, reject) => {
    execOrig(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject(error)
      }
      resolve({ stdout: stdout.trim().split('\n'), stderr })
    })
  })
}

function render(prev, version, name, fullName, file, log) {
  _l('Generating', file)
  const title = fullName + ' :: Notas de versión'
  const line = '='.repeat(title.length)
  const template = `${line}
${title}
${line}

-------
Versión
-------

* Actualmente en producción está la versión **${prev}**
* Se sube a la versión **${version}**

----------
Despliegue
----------

* El proceso de despliegue es vía Gitlab CI/CD http://10.200.172.71/backend/${name}/pipelines/new
* Definiendo la ejecución en el tag ${version} y la variable **NODE_ENV** con valor **prod**.

--------
Registro
--------

${log.join('\n')}

.. Documento generado via: rst2pdf -s sphinx ${file}
.. ver dos últimos tags: git tag -l --sort=v:refname | tail -n2`

  const realFile = path.join(__dirname, '..', 'release', file)
  return new Promise((resolve, reject) => {
    fs.writeFile(realFile, template, (err) => {
      if (err) {
        _e(err)
        reject(err)
      }
      _l('Write OK', realFile)
      resolve(realFile)
    })
  })
}
