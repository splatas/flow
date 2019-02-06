#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const { format } = require('util')
const { exec: execOrig } = require('child_process')
const { name } = require('../package.json')

const commands = {
  tags: 'git tag -l --sort=v:refname',
  log: 'git log %s --pretty="* %s" --abbrev-commit --reverse'
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
  await Promise.all([
    render(prev, version, name, file, log.stdout),
    exec(`cp ${__dirname}/../stat/openapi.json ${__dirname}/../release/openapi_${name}_${version}.json`),
    exec(`cp ${__dirname}/../shipitfile.js ${__dirname}/../release/shipitfile_${name}_${version}.js`),
  ])
  _l('Generating pdf')
  exec(`cd ${__dirname}/../release && rst2pdf -s sphinx ${file}`)
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

function render(prev, version, name, file, log) {
  _l('Generating', file)
  const template = format(`=============================
Event API :: Notas de versión
=============================

-------
Versión
-------

* Actualmente en producción está la versión **%s**
* Se sube a la versión **%s**

-------
Cambios
-------

* @TODO *detallar*
* @TODO *cambios*
* @TODO *funcionalmente*

----------
Despliegue
----------

* Generar un directorio temporal donde se ejecutará el despliegue
* $ cd $(mktemp -d)
* Copiar/mover el par de claves ssl que permite acceso a los servidores un nivel arriba de este directorio
* $ mv path/to/shipitfile_%s_%s.js shipitfile.js
* $ npm i shipit shipit-deploy
* $ DEPLOY_BRANCH=%s npx shipit prod deploy
* Si las pruebas fallan no sube la nueva versión y no hace falta tomar acción
* Si las pruebas no fallan pero luego se considera que hay que retroceder de versión (rollback)

---------
Retroceso
---------

El proceso de rollback es:

  $ npx shipit prod rollback

--------
Registro
--------

%s

.. Documento generado via: rst2pdf -s sphinx %s
.. ver dos últimos tags: git tag -l --sort=v:refname | tail -n2`, prev, version, name, version, version, log.join('\n'), file)

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
