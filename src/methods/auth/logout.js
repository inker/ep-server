const db = require('../../db')

module.exports = async ({ auth }) => {
  if (!auth) {
    return {
      error: {
        type: 'NO_AUTH',
      },
    }
  }

  await db.redis.delAsync(`user-session-${auth.token}`)

  return {
    data: {},
  }
}
