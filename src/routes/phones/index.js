const express = require('express')

const router = express.Router()

const routes = [
  'add',
  'remove',
  'check',
]

for (const route of routes) {
  router.post(`/${route}`, require(`./${route}`))
}

module.exports = router
