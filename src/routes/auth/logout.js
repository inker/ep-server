const db = require('../../db')

module.exports = async (req, res) => {
  const { auth } = req.body
  try {
    await db.redis.delAsync(`user-session-${auth.token}`)
  } catch (err) {
    console.error(err)
    res.send({
      error: 'DB_ERROR',
    })
    return    
  }

  res.send({
    data: {},
  })
}
