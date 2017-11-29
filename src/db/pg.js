const { Client } = require('pg')

const HW = 'Hello world!'

function tryReconnect(err, options, reconnectTimeout) {
  if (err) {
    console.error(err)
  }
  if (typeof reconnectTimeout === 'number' && reconnectTimeout >= 0) {
    setTimeout(() => connect(options), reconnectTimeout)
  }
}

async function connect(options) {
  const { reconnectTimeout, ...instanceConfig } = options
  const client = new Client(instanceConfig)
  client.on('error', err => tryReconnect(err, instanceConfig, reconnectTimeout))
  client.on('end', () => tryReconnect(null, instanceConfig, reconnectTimeout))

  console.log('Connecting to Postgres')
  await client.connect()

  const res = await client.query('SELECT $1::text as message', [HW])
  if (res.rows[0].message !== HW) {
    throw new Error('Something is wrong with Postgres')
  }
  return client
}

module.exports = connect
