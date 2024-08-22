let mongoose = require('mongoose');

let server = "mongodb+srv://bario:golangrules@cluster0.e3q8cug.mongodb.net"

let database = "initial"

class Database {
  constructor() {
    this._connect()
  }
  
  _connect() {
    mongoose.connect(`${server}/${database}`)
      .then(() => {
        console.log(server, database)
        console.log('Database connection successful')
      })
      .catch(err => {
        console.error('Database connection error', err)
      })
  }
}

module.exports = new Database()
