const mysql = require('mysql')
const delegate = require('delegates')
const EventEmitter = require('events')
const Connection = require('./Connection')

function Pool (options) {
  this.pool = mysql.createPool(options)
  this.pool.on('connection', connection => {
    this.emit('connection', new Connection({connection}))
  })
  this.pool.on('enqueue', () => {
    this.emit('enqueue')
  })
  delegate(this, 'pool')
    .method('escape')
}

const proto = Pool.prototype = Object.create(EventEmitter.prototype)

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
        resolve({results, fields})
      }
    })
    this.pool.query.apply(this.pool, args)
  })
}

proto.getConnection = function () {
  return new Promise((resolve, reject) => {
    this.pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        resolve(new Connection({connection}))
      }
    })
  })
}

proto.end = function () {
  return new Promise((resolve, reject) => {
    this.pool.end(err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

module.exports = Pool
