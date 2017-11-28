const startPg = require('./pg')
const startRedis = require('./redis')

exports.start = async () => {
  const o = {
    pg: startPg(),
    redis: startRedis(),
  }

  for (const [key, val] of Object.entries(o)) {
    exports[key] = await val
  }
}
