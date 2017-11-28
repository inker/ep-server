process.env.TZ = 'Europe/Moscow'

const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const {
  server: {
    host,
    port,
  },
} = require('../config.json')

const db = require('./db')

const app = express()

app.set('views', `${__dirname}/views`)
app.set('view cache', true)

app.use(require('compression')()) // should be first

app.use(bodyParser.urlencoded({ extended: false })) // to support URL-encoded bodies
app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(cors())

app.use('/auth', require('./routes/auth'))
app.use('/phone', require('./routes/phone'))

app.use(express.static(`${__dirname}/client`))

const server = http.createServer(app)

db.start().then(() => {
  server.listen(port, host, () => {
    console.log('server is running on', `${host}:${port}`)
  })
}).catch(console.error)
