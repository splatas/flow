'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('devices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      mac: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      customer_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      avatar: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    })
      .then(() => queryInterface.addConstraint('devices', {
        fields: ['mac'],
        type: 'unique',
      }))
      .then(() => queryInterface.addIndex('devices', {
        fields: ['customer_id'],
      })),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('devices')
}
