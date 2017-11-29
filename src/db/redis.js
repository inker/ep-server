const redis = require('redis')
const bluebird = require('bluebird')
const chalk = require('chalk').default

const redisObject = require('../../config.json').redis

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

module.exports = async () => {
  const keys = Object.keys(redisObject)
  const o = {}
  const promises = keys.map(key => new Promise((resolve, reject) => {
    const { port } = redisObject[key]
    const client = redis.createClient({
      port,
    })
    client.on('error', reject)
    client.on('ready', () => {
      resolve(client)
      console.log(`Redis (${key}) started on`, port)
    })
  }).then(client => {
    o[key] = client
  }))

  await Promise.all(promises)
  console.log(chalk.green('Redis instances started'))
  return o
}
