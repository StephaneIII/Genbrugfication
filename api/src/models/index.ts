import Checkout from './checkout.model.js'
import CheckoutItem from './checkout-item.model.js'
import RecyclingStation from './recycling-station.model.js'
import Route from './route.model.js'
import Stops from './stops.model.js'
import Trash from './trash.model.js'
import TrashCategory from './trash-category.model.js'
import User from './user.model.js'
import sequelize from '../database/sequelize.js'
import friend from './Friend.js'
import { Sequelize } from 'sequelize'
import Friend from './Friend.js'

interface DbInterface {
  Sequelize: typeof Sequelize
  sequelize: typeof sequelize
  Checkout: typeof Checkout
  CheckoutItem: typeof CheckoutItem
  RecyclingStation: typeof RecyclingStation
  Route: typeof Route
  Stops: typeof Stops
  Trash: typeof Trash
  TrashCategory: typeof TrashCategory
  User: typeof User
  Friend: typeof Friend
}

const db: DbInterface = {
  Sequelize,
  sequelize,
  Checkout,
  CheckoutItem,
  RecyclingStation,
  Route,
  Stops,
  Trash,
  TrashCategory,
  User,
  Friend,
}

db.Trash.belongsTo(db.TrashCategory, { foreignKey: 'TrashCategoryID' })
db.CheckoutItem.belongsTo(db.Trash, { foreignKey: 'TrashID' })
db.Checkout.hasMany(db.CheckoutItem, { foreignKey: 'CheckoutID' })
db.User.hasMany(db.Checkout, { foreignKey: 'UID' })
db.Friend.belongsTo(db.User, { foreignKey: 'FirstUID', as: 'FirstUser' })
db.Friend.belongsTo(db.User, { foreignKey: 'SecondUID', as: 'SecondUser' })
db.Stops.belongsTo(db.User, { foreignKey: 'userId' })
db.Route.belongsTo(db.User, { foreignKey: 'UID' })
db.Route.hasMany(db.Stops, { foreignKey: 'routeId' })
db.Route.belongsTo(db.RecyclingStation, { foreignKey: 'RecyclingStationID' })

export default db
