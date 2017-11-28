const express = require('express')

const router = express.Router()

const routes = [
  'verify',
  'login',
  'logout',
]

for (const route of routes) {
  router.post(`/${route}`, require(`./${route}`))
}

module.exports = router
