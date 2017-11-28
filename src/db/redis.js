const redis = require('redis')
const bluebird = require('bluebird')
const chalk = require('chalk').default

const { port } = require('../../config.json').redis

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

module.exports = () =>
  new Promise((resolve, reject) => {
    const client = redis.createClient({
      port,
    })

    client.on('error', reject)
    client.on('ready', () => {
      resolve(client)
      console.log(chalk.green('Redis started'), port)
    })
  })

