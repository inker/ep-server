const { Client } = require('pg')
const chalk = require('chalk').default

const config = require('../../config.json')

const HW = 'Hello world!'

function tryReconnect(err, key, reconnectTimeout) {
  if (err) {
    console.error(err)
  }
  if (typeof reconnectTimeout === 'number' && reconnectTimeout >= 0) {
    setTimeout(() => connect(key), reconnectTimeout)
  }
}

async function connect(key) {
  const { reconnectTimeout, ...instanceConfig } = config.pg[key]
  const client = new Client(instanceConfig)
  client.on('error', err => tryReconnect(err, key, reconnectTimeout))
  client.on('end', () => tryReconnect(null, key, reconnectTimeout))

  console.log('Connecting to Postgres')
  await client.connect()

  const res = await client.query('SELECT $1::text as message', [HW])
  if (res.rows[0].message !== HW) {
    throw new Error('Something is wrong with Postgres')
  }
  console.log(`Portgres (${key}) started on ${instanceConfig.port}`)
  return client
}

module.exports = async () => {
  const keys = Object.keys(config.pg)
  const o = {}
  const promises = keys.map(key => connect(key).then(client => {
    o[key] = client
  }))
  await Promise.all(promises)
  console.log(chalk.green('Postgres instances started'))
  return o
}
