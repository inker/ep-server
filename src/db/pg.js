const { Client } = require('pg')

const config = require('../../config.json')

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

  console.log('connecting to Postgres')
  await client.connect()

  const res = await client.query('SELECT $1::text as message', ['Hello world!'])
  console.log(res.rows[0].message) // Hello world!
  console.log('Postgres started')
  return client
}

module.exports = connect
