const bcrypt = require('bcrypt')

const { keyTimeout } = require('../../../config.json').redis
const db = require('../../db')
const generateToken = require('../../utils/generateToken')

const SELECT_USER_QUERY = 'SELECT * FROM users WHERE username = $1;'

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
    const { rows } = await db.pg.query({
      text: SELECT_USER_QUERY,
      values: [auth.login],
    })
    if (rows.length === 0) {
      return res.send({
        error: {
          type: 'NO_SUCH_USER',
        },
      })
    }

    const row = rows[0]

    const passwordIsCorrect = await bcrypt.compare(auth.password, row.password)
    if (!passwordIsCorrect) {
      return res.send({
        error: {
          type: 'INCORRECT_PASSWORD',
        },
      })
    }

    const token = generateToken()

    await db.redis.setexAsync(`user-session-${token}`, keyTimeout, row.id)
    res.send({
      data: {
        token,
      },
    })
  } catch (err) {
    console.error(err)
    return res.send({
      error: {
        type: 'SERVER_ERROR',
      },
    })
  }
}
