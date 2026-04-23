import { DataTypes } from 'sequelize'
import sequelize from '../database/sequelize.js'

const RecyclingStation = sequelize.define(
  'RecyclingStation',
  {
    RecyclingStationID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Address: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Url: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    Recipient: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    XCoord: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    YCoord: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    PostNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    OpeningHours: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ImageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
}
  },
  {
    timestamps: false,
  },
)

export default RecyclingStation
