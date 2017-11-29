const db = require('../../db')

const SELECT_USER_ID_QUERY = 'SELECT id FROM users WHERE username = $1;'

module.exports = async ({ auth }) => {
  if (!auth) {
    return {
      error: {
        type: 'NO_AUTH',
      },
    }
  }

  if (!auth.token) {
    return {
      error: {
        type: 'INVALID_TOKEN',
      },
    }
  }

  try {
    const redisUserId = await db.redis.getAsync(`user-session-${auth.token}`)
    console.log(`user-session-${auth.token}`, redisUserId)

    const { rows } = await db.pg.query({
      text: SELECT_USER_ID_QUERY,
      values: [auth.login],
    })
    const pgUserId = rows[0].id.toString()
    if (!redisUserId || redisUserId !== pgUserId) {
      return {
        error: {
          type: 'INVALID_TOKEN',
        },
      }
    }
  } catch (err) {
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
