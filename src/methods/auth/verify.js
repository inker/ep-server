const db = require('../../db')

const SELECT_USER_ID_QUERY = 'SELECT id FROM users WHERE username = $1;'

module.exports = async ({ auth }) => {
  if (!auth.token) {
    return {
      error: {
        type: 'INVALID_TOKEN',
      },
    }
  }

  const redisUserId = await db.redis.sessions.getAsync(`user-session-${auth.token}`)

  const { rows } = await db.pg.main.query({
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

  return {
    data: {},
  }
}
