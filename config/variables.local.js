const variables = {
  PROJECT: 'base',
  enable_logs: false,
  enable_loggly: false,
  port: 8100,
  minerva_host: 'geo.mnedge.cvattv.com.ar',
  environment: 'local',
  expose_api: false,
  home: '/opt/nodejs',
  deploy_branch: 'develop',
  deploy_test: false,
  JWT_SECRET: process.env.SECRET
}

module.exports = variables
