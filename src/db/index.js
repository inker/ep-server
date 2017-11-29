const chalk = require('chalk').default

const config = require('../../config.json')

const storages = [
  'pg',
  'redis',
]

/**
 * @returns {Object} db object with clients
 */
exports.start = async () => {
  const promises = storages.map(storageName => {
    const o = {}
    const storage = config[storageName]
    const entries = Object.entries(storage)
    const storagePromises = entries.map(async ([key, options]) => {
      const instance = await require(`./${storageName}`)(options)
      o[key] = instance
      console.log(chalk.cyan(`Connected to ${storageName} (${key}) running on ${options.host || 'localhost'}:${options.port}`))
    })
    return Promise.all(storagePromises).then(() => {
      exports[storageName] = o
    })
  })
  await Promise.all(promises)
  console.log(chalk.green('All databases started'))
}
