const path = require('path')
const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const connectDB = require('./backend/config/db')
const { errorHandler } = require('./backend/middleware/errorMiddleware')

connectDB()
const app = express()

app.use(express.json())

app.use('/api/event', require('./backend/routes/eventRoutes'))
app.use('/api/user', require('./backend/routes/userRoutes'))
app.use('/api/flyer', require('./backend/routes/flyerRoutes'))

const folder = path.resolve()
app.use('/flyers', express.static(path.join(folder, '/flyers')))

// Serve frontend:
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, './frontend/build')))
  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, './', 'frontend', 'build', 'index.html')
    )
  )
} else {
  app.get('/', (req, res) => res.send('Not in production mode'))
}

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} on port ${PORT}`.cyan
      .underline
  )
)
