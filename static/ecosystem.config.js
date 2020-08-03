const pack = require('../package.json')
const vars = require('../config/vars')
const inServer = vars.home || null

const app = {
  name: pack.name,
  script: 'src/core/server.js',
  instances: 'max',
  exec_mode: 'cluster',
  trace: true,
  disable_trace: false,
  env: {
    PORT: pack.config.port,
    CUSTOM_LOGS: 'no',
    MINERVA_HOST: 'geo.app.int.cvattv.com.ar'
  },
  node_args: '--max_old_space_size=2048'
}

if (inServer) {
  app.cwd = '/opt/nodejs/repos/base-jaxx/current'
  app.out_file = '/opt/nodejs/.pm2/logs/pm2-base-jaxx-out.log'
  app.error_file = '/opt/nodejs/.pm2/logs/pm2-base-jaxx-error.log'
}

module.exports = { apps: [app] }
