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

router.post('/verify', async (req, res) => {
  console.log('data', req.body)
  const { auth } = req.body
  if (!auth.token) {
    return res.status(200).send({
      error: 'INVALID_TOKEN',
    })    
  }
  let userId
  try {
    userId = await db.redis.getAsync(`user-session-${auth.token}`)
    console.log(`user-session-${auth.token}`, userId)
  } catch (err) {
    return res.status(200).send({
      error: 'DB_ERROR',
    })
  }
  console.log('id', userId)
  /// TODO: get USER_ID from pg
  if (!userId || userId !== USER_ID.toString()) {
    return res.status(200).send({
      error: 'INVALID_TOKEN',
    })
  }
  res.status(200).send({
    data: {},
  })
})

router.post('/login', async (req, res) => {
  console.log('data', req.body)
  const { auth } = req.body
  if (auth.login !== LOGIN) {
    return res.status(200).send({
      error: 'NO_SUCH_USER',
    })
  }
  const passwordIsCorrect = await bcrypt.compare(auth.password, HASH)
  if (!passwordIsCorrect) {
    return res.status(200).send({
      error: 'INCORRECT_PASSWORD',
    })
  }
  const token = generateToken()
  try {
    await db.redis.setexAsync(`user-session-${token}`, 86400, USER_ID)
  } catch (err) {
    console.error(err)
    return res.status(200).send({
      error: 'DB_ERROR',
    })
  }
  res.status(200).send({
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
    res.status(200).send({
      error: 'DB_ERROR',
    })
    return    
  }
  res.status(200).send({
    data: {},
  })
})

module.exports = router
