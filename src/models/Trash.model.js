modules.exports = (sequelize, DataTypes) => {
  const Trash = sequelize.define('Trash', {
    TrashID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    TrashCategoryID: {
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
  })
  return Trash
}
