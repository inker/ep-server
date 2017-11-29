process.env.TZ = 'Europe/Moscow'

const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const chalk = require('chalk').default

const { port } = require('../config.json').server

const logger = require('./middleware/logger')
const permissions = require('./middleware/permissions')

const db = require('./db')

const app = express()

app.set('views', `${__dirname}/views`)
app.set('view cache', true)

app.use(require('compression')()) // should be first

app.use(bodyParser.urlencoded({ extended: false })) // to support URL-encoded bodies
app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(cors())

app.use(logger())
app.use(permissions({
  exemptServices: 'auth',
}))

app.use('/auth', require('./routes/auth'))
app.use('/phones', require('./routes/phones'))

app.use(express.static(`${__dirname}/client`))

const server = http.createServer(app)

db.start().then(() => {
  server.listen(port, () => {
    console.log(chalk.green('Server is running'), port)
  })
}).catch(console.error)
