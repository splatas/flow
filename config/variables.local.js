const DEFAULT_VARIABLES = require('./default_variables')
const variables = new DEFAULT_VARIABLES()

variables.environment = 'local'
variables.home = null
variables.enable_logs = false
variables.enable_loggly = false
variables.expose_api = false
variables.database = {
  user: process.env.DATABASE_USER || 'retail',
  password: process.env.DATABASE_PASSWORD || 'retail',
  db: process.env.DATABASE_DB || 'src/retail.db',
  host: process.env.DATABASE_HOST || 'localhost',
  dialect: process.env.DATABASE_DIALECT || 'sqlite',
}

module.exports = variables
