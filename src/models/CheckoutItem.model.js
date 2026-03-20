modules.exports = (sequelize, DataTypes) => {
  const CheckoutItem = sequelize.define('CheckoutItem', {
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
  })
  return CheckoutItem
}
