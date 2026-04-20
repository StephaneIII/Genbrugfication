import app from './app.js'

const port = Number(process.env.PORT) || 3001

app.listen(port, () => {
  console.log(`API running on port ${port}`)
})
