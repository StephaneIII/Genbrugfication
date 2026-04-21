import { DataTypes } from 'sequelize'
import sequelize from '../database/sequelize.js'

const TrashCategory = sequelize.define(
  'TrashCategory',
  {
    TrashCategoryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  },
)

export default TrashCategory
