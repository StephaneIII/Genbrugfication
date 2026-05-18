import { DataTypes } from 'sequelize'
import sequelize from '../database/sequelize.js'

const Trash = sequelize.define(
  'Trash',
  {
    TrashID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    TrashCanID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    Url: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    IsRecyclingStation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    Score: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
  },
  {
    timestamps: false,
  },
)

export default Trash
