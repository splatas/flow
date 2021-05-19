module.exports = (sequelize, DataTypes) => {
  const deviceModel = sequelize.define('devices', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
    },
    mac: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'mac',
      unique: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'status',
    },
    customer_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'customer_id',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'name',
    },
    avatar: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'avatar',
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
    underscored: true,
    freezeTableName: true,
    tableName: 'devices',
    indexes: [{ unique: true, fields: ['mac'], }],
  })

  deviceModel.associate = function (models) {
    deviceModel.hasMany(models.Alphanum, {
      foreignKey: 'device_id',
      as: 'alphanum',
      onDelete: 'CASCADE'
    })
  }

  return deviceModel
}
