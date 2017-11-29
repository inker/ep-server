const bcrypt = require('bcrypt')

const config = require('../../../config.json')
const db = require('../../db')
const generateToken = require('../../utils/generateToken')

const SELECT_USER_QUERY = 'SELECT * FROM users WHERE username = $1;'

async function createSession(userId) {
  const token = generateToken()
  const { keyTimeout } = config.redis.sessions
  await db.redis.sessions.setexAsync(`user-session-${token}`, keyTimeout, userId)
  return token
}

module.exports = async ({ auth }) => {
  if (!auth) {
    return {
      error: {
        type: 'NO_AUTH',
      },
    }
  }

  const { rows } = await db.pg.main.query({
    text: SELECT_USER_QUERY,
    values: [auth.login],
  })
  if (rows.length === 0) {
    return {
      error: {
        type: 'NO_SUCH_USER',
      },
    }
  }

  const row = rows[0]

  const passwordIsCorrect = await bcrypt.compare(auth.password, row.password)
  if (!passwordIsCorrect) {
    return {
      error: {
        type: 'INCORRECT_PASSWORD',
      },
    }
  }

  const token = await createSession(row.id)
  return {
    data: {
      token,
    },
  }
}
