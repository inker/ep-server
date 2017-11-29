const db = require('../../db')

module.exports = async ({ auth }) => {
  if (!auth) {
    return {
      error: {
        type: 'NO_AUTH',
      },
    }
  }

  try {
    await db.redis.delAsync(`user-session-${auth.token}`)
  } catch (err) {
    console.error(err)
    return {
      error: {
        type: 'SERVER_ERROR',
      },
    }
  }

  return {
    data: {},
  }
}
