const env = process.env.NODE_ENV || 'test'

const {
  user: username, password, db: database, host, dialect
} = require('./variables').database

const db = {
  [env]: {
    username,
    password,
    database,
    host,
    dialect,
  }
}

if (dialect === 'sqlite') {
  db[env].storage = db[env].database
  delete db[env].database
}

module.exports = db
