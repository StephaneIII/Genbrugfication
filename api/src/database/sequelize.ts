import { Sequelize } from 'sequelize'

interface DbPoolConfig {
  max: number
  min: number
  acquire: number
  idle: number
}

interface DbConfig {
  HOST: string
  USER: string
  PASSWORD: string
  DB: string
  PORT: number
  dialect: 'mysql'
  pool: DbPoolConfig
}

const configModule = await import(new URL('../../config/db.config.js', import.meta.url).href)
const dbConfig = configModule.default as DbConfig

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
  logging: false,
})

export default sequelize
