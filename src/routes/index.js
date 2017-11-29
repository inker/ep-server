const express = require('express')

const router = express.Router()

module.exports = (routes) => {
  if (!routes) {
    throw new Error('Provide router object')
  }
  for (const route of Object.keys(routes)) {
    const methods = routes[route]
    for (const method of methods) {
      router.post(`/${route}/${method}`, require(`./${route}/${method}`))
    }
  }
  return router
}
