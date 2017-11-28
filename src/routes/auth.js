const express = require('express')
const bcrypt = require('bcrypt')

const generateToken = require('../utils/generateToken')
const hash = require('../utils/hash')

const db = require('../db')

const router = express.Router()

router.post('/verify', async (req, res) => {
  console.log('data', req.body)

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
})

router.post('/login', async (req, res) => {
  console.log('data', req.body)
  const { auth } = req.body

  let rows
  try {
    const res = await db.pg.query(`SELECT * FROM users WHERE username='${auth.login}'`)
    rows = res.rows
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
})

router.post('/logout', async (req, res) => {
  console.log('data', req.body)

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
})

module.exports = router
