const db = require('../../db')

module.exports = async (req, res) => {
  const { auth } = req.body

  if (!auth) {
    return res.send({
      error: {
        type: 'NO_AUTH',
      },
    })
  }

  try {
    await db.redis.delAsync(`user-session-${auth.token}`)
  } catch (err) {
    console.error(err)
    return res.send({
      error: {
        type: 'SERVER_ERROR',
      },
    })
  }

  res.send({
    data: {},
  })
}
