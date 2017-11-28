const bluebird = require('bluebird')
const redis = require('redis')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

module.exports = () =>
  new Promise((resolve, reject) => {
    const client = redis.createClient({
      port: 6379,
    })
    
    client.on('error', reject)
    client.on('ready', () => {
      resolve(client)
      console.log('Redis started')
    })
  })

