'use strict'
class DEFAULT_VARIABLES {
  constructor() {
    this.PROJECT = 'base'
    this.enable_logs = true
    this.enable_loggly = true
    this.port = 8100
    this.minerva_host = 'geo.mnedge.cvattv.com.ar'
    this.expose_api = true
    this.home = '/opt/nodejs'
    this.deploy_branch = 'develop'
    this.deploy_test = false
    // this.environment = 'develop'
    this.JWT_SECRET = process.env.SECRET
  }
}

module.exports = DEFAULT_VARIABLES
