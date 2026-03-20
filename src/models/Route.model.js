modules.exports = (sequelize, DataTypes) => {
  const Route = sequelize.define('Route', {
    RouteID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    StartAddress: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    RecyclingStationID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    AvailableSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    MaxWeight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    DepartureTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Delay: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  })
  return Route
}
