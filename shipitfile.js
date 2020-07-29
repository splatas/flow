const path = require('path')
const deploy = require('shipit-deploy')
const util = require('util')
const parentDir = path.join(__dirname, '..')

const { name } = require('./package.json')

let thaServers
if (process.env.DEPLOY_SERVERS) {
  thaServers = process.env.DEPLOY_SERVERS.split(',')
}

const runTests = process.env.DEPLOY_TESTS !== 'no'
const testCred = {
  account: process.env.TEST_ACCOUNT,
  pass: process.env.TEST_PASS,
}
module.exports = shipit => {
  deploy(shipit)

  const deployTo = `/opt/nodejs/repos/${name}`
  const workspace = `/tmp/${name}`

  shipit.initConfig({
    default: {
      keepReleases: 5,
      deleteOnRollback: true,
      shallowClone: true,
      workspace,
      deployTo,
      ignores: [
        '.git',
        'node_modules'
      ],
      key: parentDir + '/nodejs_id_rsa',
      strict: 'no',
      repositoryUrl: `git@10.200.172.71:backend/${name}.git`,
      servers: thaServers || require('./static/servers/default.json'),
      verboseSSHLevel: 0
    },
    develop: {
      branch: process.env.DEPLOY_BRANCH || 'develop',
    },
    staging: {
      servers: thaServers || require('./static/servers/staging.json'),
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

    const gitLog = util.format('git log %s -1 --pretty=format:"%h"', branch)
    const { stdout } = await shipit.local(gitLog, { cwd: shipit.workspace })
    const version = branch + '_' + stdout.trim()

    const file = `${shipit.workspace}/package.json`
    const reversion = util.format('sed -i s/{{X-GIT-VERSION}}/%s/ %s', version, file)

    return shipit.local(reversion)
  })

  shipit.blTask('npm:test', async () => {
    const servers = shipit.config.servers
    const server = servers[Math.floor(Math.random() * servers.length)].replace(/.*@/, '')

    let creds = ''
    if (testCred.account) {
      creds = `TEST_ACCOUNT=${testCred.account} `
    }
    if (testCred.pass) {
      creds += `TEST_PASS=${testCred.pass} `
    }

    const cmd = util.format('cd %s && %s./testOneServer.sh %s', shipit.releasePath, creds, server)

    if (!runTests) {
      return null
    }

    return shipit.remote(cmd)
  })

  shipit.blTask('pm2:startOrRestart', async () => {
    const current = `${shipit.config.deployTo}/current`

    // * CD to project path
    // * generate pm2.json by NODE_ENV
    // * reload/start pm2
    // * dump pm2 apps to file
    const cmd = util.format('cd $(realpath %s) && npm run pm2 && pm2 reload pm2.json -a && pm2 save', current)

    return shipit.remote(cmd)
  })

  shipit.blTask('runAutomationTests', () => {
    const capital = shipit.environment[0].toUpperCase() + shipit.environment.substring(1)
    const cmd = `curl http://10.200.172.73:8080/generic-webhook-trigger/invoke?token=Tr1gg3r:Run-ApiGatewayAuth-${capital}`
    return shipit.local(cmd)
  })

  shipit.task('postinit', ['create:workspace'])

  shipit.task('postupdated', ['npm:install', 'npm:test'])

  shipit.task('postdeployed', ['pm2:startOrRestart', 'runAutomationTests'])

  shipit.task('postrollbacked', ['pm2:startOrRestart', 'runAutomationTests'])

  shipit.on('init', async () => shipit.start('postinit'))

  shipit.on('fetched', async () => shipit.start('reversion'))

  shipit.on('updated', async () => shipit.start('postupdated'))

  shipit.on('deployed', async () => shipit.start('postdeployed'))

  shipit.on('rollbacked', async () => shipit.start('postrollbacked'))
}
