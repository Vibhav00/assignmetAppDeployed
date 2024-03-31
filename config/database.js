const mongoose = require('mongoose')


// function to connect with database with mongoose
const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server:${data.connection.host}`)
    })
}

module.exports = connectDatabase
