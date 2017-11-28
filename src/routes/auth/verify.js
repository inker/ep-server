const db = require('../../db')

module.exports = async (req, res) => {
  const { auth } = req.body
  if (!auth.token) {
    return res.send({
      error: 'INVALID_TOKEN',
    })
  }

  try {
    const redisUserId = await db.redis.getAsync(`user-session-${auth.token}`)
    console.log(`user-session-${auth.token}`, redisUserId)

    const { rows } = await db.pg.query(`SELECT id FROM users WHERE username='${auth.login}'`)
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
