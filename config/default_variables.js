'use strict'
class DEFAULT_VARIABLES {
  constructor() {
    this.PROJECT = 'retail'
    this.enable_logs = true
    this.enable_loggly = true
    this.port = 8090
    this.minerva_host = 'geo.mnedge.cvattv.com.ar'
    this.expose_api = true
    this.home = '/opt/nodejs'
    this.deploy_branch = 'develop'
    this.deploy_test = false
    // this.environment = 'develop'
    this.JWT_SECRET = process.env.SECRET
    this.database = {
      user: process.env.DATABASE_USER || 'retail',
      password: process.env.DATABASE_PASSWORD || 'retail',
      db: process.env.DATABASE_DB || 'src/retail.db',
      host: process.env.DATABASE_HOST || 'localhost',
      dialect: process.env.DATABASE_DIALECT || 'sqlite',
    }
  }
}

module.exports = DEFAULT_VARIABLES
