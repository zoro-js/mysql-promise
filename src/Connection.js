const mysql = require('mysql')
const delegate = require('delegates')

function Connection (options) {
  if (options.connection) {
    this.connection = options.connection
  } else {
    this.connection = mysql.createConnection(options)
  }
  delegate(this, 'connection')
    .getter('threadId')
    .access('config')
    .method('escape')
    .method('destroy')
    .method('release')
    .method('on')
}

const proto = Connection.prototype

proto.connect = function () {
  return new Promise((resolve, reject) => {
    this.connection.connect(err => {
      if (err) {
        reject(err)
      } else {
        resolve(this)
      }
    })
  })
}

proto.end = function () {
  return new Promise((resolve, reject) => {
    this.connection.end(err => {
      if (err) {
        reject(err)
      } else {
        resolve(this)
      }
    })
  })
}

proto.query = function () {
  const args = Array.prototype.slice.call(arguments)
  return new Promise((resolve, reject) => {
    if (typeof args[args.length - 1] === 'function') {
      args.splice(args.length - 1, 1)
    }
    args.push((err, results, fields) => {
      if (err) {
        reject(err)
      } else {
        resolve({
          result: results,
          results,
          fields
        })
      }
    })
    this.connection.query.apply(this.connection, args)
  })
}

proto.changeUser = function (options) {
  return new Promise((resolve, reject) => {
    this.connection.changeUser(options, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

proto.beginTransaction = function () {
  return new Promise((resolve, reject) => {
    this.connection.beginTransaction(err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

proto.commit = function () {
  return new Promise((resolve, reject) => {
    this.connection.commit(err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

proto.rollback = function () {
  return new Promise((resolve, reject) => {
    this.connection.rollback(err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

proto.ping = function () {
  return new Promise((resolve, reject) => {
    this.connection.ping(err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

module.exports = Connection
