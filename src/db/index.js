const storages = [
  'pg',
  'redis',
]

const numStorages = storages.length

exports.start = async () => {
  const promises = storages.map(storage => require(`./${storage}`)())
  for (let i = 0; i < numStorages; ++i) {
    const key = storages[i]
    exports[key] = await promises[i]
  }
}
