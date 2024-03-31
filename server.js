const app = require('./app')
const mongoose = require('mongoose')

// initialize environment variables
const dotenv = require('dotenv')
dotenv.config({ path: './config/config.env' })

// database connection
const connectDatabase = require('./config/database')
connectDatabase()

// starting server
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is working on http://127.0.0.1:${process.env.PORT}`)
})

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully')
  server.close(() => {
    console.log('💥 Process terminated!')
  })
})
