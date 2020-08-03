const variables = {
  PROJECT: 'base',
  enable_logs: true,
  enable_loggly: true,
  port: 8100,
  minerva_host: 'geo.mnedge.cvattv.com.ar',
  environment: 'staging',
  expose_api: true,
  home: '/opt/nodejs',
  deploy_branch: 'master',
  deploy_test: false,
  JWT_SECRET: process.env.SECRET
}

module.exports = variables
