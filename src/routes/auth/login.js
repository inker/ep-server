const bcrypt = require('bcrypt')

const db = require('../../db')
const generateToken = require('../../utils/generateToken')

module.exports = async (req, res) => {
  const { auth } = req.body

  let rows
  try {
    const result = await db.pg.query(`SELECT * FROM users WHERE username='${auth.login}'`)
    rows = result.rows
  } catch (err) {
    console.error(err)
    return res.send({
      error: 'DB_ERROR',
    })
  }

  if (rows.length === 0) {
    return res.send({
      error: 'NO_SUCH_USER',
    })
  }

  const row = rows[0]
  console.log('row', row)

  const passwordIsCorrect = await bcrypt.compare(auth.password, row.password)
  if (!passwordIsCorrect) {
    return res.send({
      error: 'INCORRECT_PASSWORD',
    })
  }

  const token = generateToken()
  try {
    await db.redis.setexAsync(`user-session-${token}`, 86400, row.id)
  } catch (err) {
    console.error(err)
    return res.send({
      error: 'DB_ERROR',
    })
  }
  res.send({
    data: {
      token,
    },
  })
}
