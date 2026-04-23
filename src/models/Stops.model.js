modules.exports = (sequelize, DataTypes) => {
  const Stops = sequelize.define('Stops', {
    routeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
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
    },
    PassengerAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  })
  return Stops
}
