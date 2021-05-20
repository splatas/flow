const env = process.env.NODE_ENV || 'test'
const Sequelize = require('sequelize')
const database = require('../../config/database')[env]

const sequelize = new Sequelize(database)

let authPromise
if (database.dialect !== 'sqlite') {
  authPromise = sequelize.authenticate()
}

const db = {
  Device: require('./device')(sequelize, Sequelize.DataTypes),
  Alphanum: require('../models/alphanum')(sequelize, Sequelize.DataTypes),
}

db.models = []
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize
db.authPromise = authPromise

module.exports = db
