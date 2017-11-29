const db = require('../../db')

const SELECT_USER_ID_QUERY = 'SELECT id FROM users WHERE username = $1;'

module.exports = async (req, res) => {
  const { auth } = req.body

  if (!auth) {
    return res.send({
      error: 'NO_AUTH',
    })
  }

  if (!auth.token) {
    return res.send({
      error: 'INVALID_TOKEN',
    })
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
      return res.send({
        error: 'INVALID_TOKEN',
      })
    }
  } catch (err) {
    return res.send({
      error: 'SERVER_ERROR',
    })
  }

  res.send({
    data: {},
  })
}
