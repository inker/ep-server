const express = require('express')
const bcrypt = require('bcrypt')

const generateToken = require('../utils/generateToken')
const hash = require('../utils/hash')

const db = require('../db')

const router = express.Router()

const USER_ID = 1
const LOGIN = 'easypay'
const PASSWORD = '1234'
const HASH = '$2a$10$RkPPOOI837gFVjjrDWpTv.qJUd8ytpiVZiD85B776cqflHmu4TeAe'

router.post('/login', async (req, res) => {
  hash(PASSWORD).then(console.log)
  console.log('req', req)
  const data = req.body
  console.log('data', data)
  const { auth } = req.body
  if (auth.login !== LOGIN) {
    res.status(200).send({
      error: 'NO_SUCH_USER',
    })
    return
  }
  const passwordIsCorrect = await bcrypt.compare(auth.password, HASH)
  if (!passwordIsCorrect) {
    res.status(200).send({
      error: 'INCORRECT_PASSWORD',
    })
    return
  }
  const token = generateToken()
  try {
    await db.redis.setex(`user-session-${token}`, 86400, USER_ID)
  } catch (err) {
    res.status(200).send({
      error: 'DB_ERROR',
    })
    return
  }
  res.status(200).send({
    data: {
      token,
    },
  })
})

router.post('/logout', (req, res) => {
  const data = req.body
  console.log('data', data)
  res.status(200).send({
    data: {},
  })
})

module.exports = router
