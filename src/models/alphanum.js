module.exports = (sequelize, DataTypes) => {
  const alphanumModel = sequelize.define('alphanum', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'code',
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    },
  }, {
    timestamps: true,
    freezeTableName: true,
    tableName: 'alphanum',
    indexes: [
      {
        unique: true,
        fields: ['code'],
      },
    ],
  })

  alphanumModel.associate = function (models) {
    alphanumModel.belongsTo(models.Device, {
      foreignKey: 'device_id'
    })
  }

  return alphanumModel
}
