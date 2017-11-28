const db = require('../../db')

module.exports = async (req, res) => {
  const { auth } = req.body
  if (!auth.token) {
    return res.send({
      error: 'INVALID_TOKEN',
    })
  }

  let redisUserId
  try {
    redisUserId = await db.redis.getAsync(`user-session-${auth.token}`)
    console.log(`user-session-${auth.token}`, redisUserId)
  } catch (err) {
    return res.send({
      error: 'DB_ERROR',
    })
  }
  console.log('id', redisUserId)

  let pgUserId
  try {
    const { rows } = await db.pg.query(`SELECT id FROM users WHERE username='${auth.login}'`)
    pgUserId = rows[0].id.toString()
  } catch (err) {
    console.error(err)
    return res.send({
      error: 'DB_ERROR',
    })
  }

  if (!redisUserId || redisUserId !== pgUserId) {
    return res.send({
      error: 'INVALID_TOKEN',
    })
  }

  res.send({
    data: {},
  })
}
