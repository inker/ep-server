const chalk = require('chalk').default

const config = require('../../config.json')

const storages = [
  'pg',
  'redis',
]

exports.start = async () => {
  const promises = storages.map(storageName => {
    const o = {}
    const storage = config[storageName]
    const entries = Object.entries(storage)
    const storagePromises = entries.map(async ([key, options]) => {
      const instance = await require(`./${storageName}`)(options)
      o[key] = instance
      console.log(chalk.cyan(`${storageName} (${key}) started on ${options.port}`))
    })
    return Promise.all(storagePromises).then(() => {
      exports[storageName] = o
    })
  })
  await Promise.all(promises)
  console.log(chalk.green('All databases started'))
}
