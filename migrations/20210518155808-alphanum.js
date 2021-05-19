'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.createTable('alphanum', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      device_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING(255),
        allowNull: false,
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
      .then(() => queryInterface.addConstraint('alphanum', {
        fields: ['device_id'],
        type: 'foreign key',
        references: {
          table: 'devices',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }))
      .then(() => queryInterface.addConstraint('alphanum', {
        fields: ['code'],
        type: 'unique',
      })),

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable('alphanum')
  }
}
