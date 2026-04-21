import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../database/sequelize.js'

const Friend = sequelize.define(
  'Friend',
  {
    FirstUID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    SecondUID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
  },
)

export default Friend
