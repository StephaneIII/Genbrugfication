import { DataTypes } from 'sequelize'
import sequelize from '../database/sequelize.js'

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
    UID: {
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
  },
  {
    timestamps: false,
    tableName: 'stops',
  },
)

export default Stops
