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
  const file = `${name}-${version}`
  await render(prev, version, name, fullName, file, log.stdout)
  _l('Generating HTML/PDF')
  // exec(`cd ${__dirname}/../release && rst2pdf -s sphinx ${file}.rst`)
  exec(`cd ${__dirname}/../release && rst2html5 ${file}.rst > ${file}.html && xz ${file}.html`)
})()

async function getVersion (param) {
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

function exec (cmd) {
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
  file += '.rst'
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
