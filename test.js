const mysql = require('./index')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'zyy',
  password: '123456',
  database: 'test'
})

function connect () {
  return connection.connect().then(() => {
    console.log('connected as id', connection.threadId)
  }).catch(err => {
    console.log('connect error', err)
  })
}

function query () {
  return connection.query('SELECT * FROM user').then(({results, fields}) => {
    console.log('query success', results, fields)
  }).catch(err => {
    console.log('query error', err)
  })
}

function end () {
  return connection.end().then(() => {
    console.log('end connection')
  }).catch(err => {
    console.log('end connection error', err)
  })
}

const pool = mysql.createPool({
  host: 'localhost',
  user: 'zyy',
  password: '123456',
  database: 'test'
})

pool.on('connection', connection => {
  console.log('pool - on connection', connection.threadId)
})

function queryPool () {
  return pool.query('SELECT * FROM user').then(({results, fields}) => {
    console.log('pool - query success', results, fields)
  }).catch(err => {
    console.log('pool - query error', err)
  })
}

function getConnection () {
  return pool.getConnection().then(c => {
    return c.query('SELECT * FROM user').then(({results, fields}) => {
      console.log('pool - getConnection - query success', results, fields)
    }).catch(err => {
      console.log('pool - getConnection - query error', err)
    })
  }).catch(err => {
    console.log('pool - getConnection err', err)
  })
}

connect().then(query).then(end).then(queryPool).then(getConnection)
