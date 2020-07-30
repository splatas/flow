const path = require('path')
const deploy = require('shipit-deploy')
const util = require('util')

const { name } = require('../package.json')
const parentDir = path.join(__dirname, '../..')
const noRunTests = process.env.DEPLOY_TESTS === 'no'

let thaServers
if (process.env.DEPLOY_SERVERS) {
  thaServers = process.env.DEPLOY_SERVERS.split(',')
}

module.exports = (shipit) => {
  deploy(shipit)

  const deployTo = `/opt/nodejs/repos/${name}`
  const workspace = `/tmp/${name}`

  shipit.initConfig({
    default: {
      keepReleases: 5,
      deleteOnRollback: true,
      shallowClone: false,
      updateSubmodules: true,
      workspace,
      deployTo,
      ignores: ['.git', 'node_modules'],
      key: parentDir + '/nodejs_id_rsa',
      strict: 'no',
      repositoryUrl: `git@10.200.172.71:backend/${name}.git`,
      servers: thaServers || require('./servers/default.json'),
      verboseSSHLevel: 0,
    },
    develop: {
      branch: process.env.DEPLOY_BRANCH || 'develop',
    },
    staging: {
      servers: thaServers || require('./servers/staging.json'),
      branch: process.env.DEPLOY_BRANCH || 'master',
    },
  })

  shipit.blTask('create:workspace', async () => {
    return shipit.local(util.format('mkdir -p %s', shipit.config.workspace))
  })

  shipit.blTask('npm:install', async () => {
    const cmd = util.format('cd %s && npm i', shipit.releasePath)

    return shipit.remote(cmd)
  })

  shipit.blTask('reversion', async () => {
    const branch = shipit.config.branch

    const gitLog = util.format(
      'npm i && DEPLOY_BRANCH=%s npm run openapi',
      branch
    )
    return shipit.local(gitLog, { cwd: shipit.workspace })
  })

  shipit.blTask('npm:test', async () => {
    if (noRunTests) {
      return
    }
    const servers = shipit.config.servers
    const branch = shipit.config.branch
    const server = servers[Math.floor(Math.random() * servers.length)].replace(
      /.*@/,
      ''
    )

    // mierva sux monky cox, test @ one server at time
    const cmd =
      '/usr/sbin/ip addr | grep "inet " | sed -r "s/ .*inet ([0-9\\.]+).*/\\1/" | grep -F "%s"' +
      ' && cd %s && DEPLOY_BRANCH=%s npm test || echo "Not here hao!"'
    return shipit.remote(util.format(cmd, server, shipit.releasePath, branch))
  })

  shipit.blTask('pm2:startOrRestart', async () => {
    const current = `${shipit.config.deployTo}/current`

    const cmd = util.format(
      'cd $(realpath %s) && pm2 reload -a --env %s static/ecosystem.config.js && pm2 save',
      current,
      shipit.environment
    )

    return shipit.remote(cmd)
  })

  shipit.task('postinit', ['create:workspace'])

  shipit.task('postupdated', ['npm:install', 'npm:test'])

  shipit.task('postdeployed', ['pm2:startOrRestart'])

  shipit.task('postrollbacked', ['pm2:startOrRestart'])

  shipit.on('init', async () => shipit.start('postinit'))

  shipit.on('fetched', async () => shipit.start('reversion'))

  shipit.on('updated', async () => shipit.start('postupdated'))

  shipit.on('deployed', async () => shipit.start('postdeployed'))

  shipit.on('rollbacked', async () => shipit.start('postrollbacked'))
}
