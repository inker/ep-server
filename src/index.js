process.env.TZ = 'Europe/Moscow'

const http = require('http')
const path = require('path')
const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const cors = require('cors')
const chalk = require('chalk').default

const { port } = require('../config.json').server

const logger = require('./middleware/logger')
const permissions = require('./middleware/permissions')
const router = require('./middleware/router')

const db = require('./db')

const routes = {
  auth: [
    'login',
    'logout',
    'verify',
  ],
  phones: [
    'add',
    'check',
    'remove',
    // add more methods here
  ],
  // add more routes here
}

const app = express()

app.use(compression())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use(logger())
app.use(permissions({
  exemptServices: 'auth',
}))

app.use(router(routes, path.join(__dirname, 'methods')))

app.use(express.static(`${__dirname}/client`))

const server = http.createServer(app)

db.start().then(() => {
  server.listen(port, () => {
    console.log(chalk.green(`Server is running on ${port}`))
  })
}).catch(console.error)
