const env = process.env.NODE_ENV || 'test'

const {
  DATABASE_USER, DATABASE_PASSWORD, DATABASE_DB, DATABASE_HOST, DATABASE_DIALECT
} = require('../constants/database')

const db = {
  [env]: {
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_DB,
    host: DATABASE_HOST,
    dialect: DATABASE_DIALECT,
  }
}

if(DATABASE_DIALECT === 'sqlite') {
  db[env].storage = db[env].database
  delete db[env].database
}

module.exports = db
