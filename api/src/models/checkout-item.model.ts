import { DataTypes } from 'sequelize'
import sequelize from '../database/sequelize.js'

const CheckoutItem = sequelize.define(
  'CheckoutItem',
  {
    CheckoutID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    TrashID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    Amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
)

export default CheckoutItem
