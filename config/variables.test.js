const DEFAULT_VARIABLES = require('./default_variables')
const variables = new DEFAULT_VARIABLES()

variables.environment = 'test'
variables.home = null
variables.enable_logs = false
variables.enable_loggly = false
variables.expose_api = false

module.exports = variables
