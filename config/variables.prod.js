const DEFAULT_VARIABLES = require('./default_variables')
const variables = new DEFAULT_VARIABLES()

variables.environment = 'prod'
variables.deploy_branch = 'master'

module.exports = variables
