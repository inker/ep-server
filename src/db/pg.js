const { Client } = require('pg')
const chalk = require('chalk').default

const config = require('../../config.json')

const HW = 'Hello world!'

function tryReconnect(err) {
  if (err) {
    console.error(err)
  }
  setTimeout(connect, 3000)
}

async function connect() {
  const client = new Client(config.pg)
  client.on('error', tryReconnect)
  client.on('end', tryReconnect)

  console.log('Connecting to Postgres')
  await client.connect()

  const res = await client.query('SELECT $1::text as message', [HW])
  if (res.rows[0].message !== HW) {
    throw new Error('Something is wrong with Postgres')
  }
  console.log(chalk.green('Postgres started'), config.pg.port)
  return client
}

module.exports = connect
