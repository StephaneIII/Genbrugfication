declare module '../../config/db.config.js' {
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

  const dbConfig: DbConfig
  export default dbConfig
}
