const mysql = require('mysql')
const delegate = require('delegates')
const Connection = require('./src/Connection')
const Pool = require('./src/Pool')

const mysqlPromise = {mysql}

delegate(mysqlPromise, 'mysql')
  .method('format')

mysqlPromise.createConnection = function (options) {
  return new Connection(options)
}

mysqlPromise.createPool = function (options) {
  return new Pool(options)
}

module.exports = mysqlPromise
