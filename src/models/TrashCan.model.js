modules.exports = (sequelize, DataTypes) => {
  const TrashCan = sequelize.define('TrashCan', {
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
  })
  return TrashCan
}
