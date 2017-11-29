const redis = require('redis')
const bluebird = require('bluebird')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

module.exports = (options) =>
  new Promise((resolve, reject) => {
    const { port } = options
    const client = redis.createClient({
      port,
    })
    client.on('error', reject)
    client.on('ready', () => {
      resolve(client)
    })
  })
