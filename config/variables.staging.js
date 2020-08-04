const DEFAULT_VARIABLES = require('./default_variables')
const variables = new DEFAULT_VARIABLES()

variables.environment = 'staging'
variables.deploy_branch = 'master'

module.exports = variables
