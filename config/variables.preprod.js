const DEFAULT_VARIABLES = require('./default_variables')
const variables = new DEFAULT_VARIABLES()

variables.environment = 'preprod'
variables.deploy_branch = 'tag'
variables.JWT_SECRET = 'este es otro secret para preprod 201903'
module.exports = variables
