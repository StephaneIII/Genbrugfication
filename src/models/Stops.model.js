modules.exports = (sequelize, DataTypes) => {
  const Stops = sequelize.define(
    'Stops',
    {
      routeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'RouteID',
      },
      StopOrder: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      Address: {
        type: DataTypes.STRING(70),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'UID',
      },
      PassengerAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      Weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      Status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'Scheduled',
      },
    },
    {
      timestamps: false,
      tableName: 'stops',
    },
  )
  return Stops
}
