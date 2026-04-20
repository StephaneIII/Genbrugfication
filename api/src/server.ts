import app from './app.js'
import sequelize from './database/sequelize.js'
import './models/index.js'

const port = Number(process.env.PORT) || 3001

const startServer = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()

    app.listen(port, () => {
      console.log(`API running on port ${port}`)
    })
  } catch (error) {
    console.error('Failed to connect to database', error)
    process.exit(1)
  }
}

startServer()
