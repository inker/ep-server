const db = require('../../db')

module.exports = async ({ auth }) => {
  await db.redis.sessions.delAsync(`user-session-${auth.token}`)

  return {
    data: {},
  }
}
