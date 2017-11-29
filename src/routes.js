const express = require('express')

const router = express.Router()

module.exports = (routes) => {
  if (!routes) {
    throw new Error('Provide router object')
  }
  for (const route of Object.keys(routes)) {
    const methodNames = routes[route]
    for (const methodName of methodNames) {
      const method = require(`./methods/${route}/${methodName}`)
      router.post(`/${route}/${methodName}`, (req, res) => {
        return method(req.body).then(resData => {
          res.send(resData)
        })
      })
    }
  }
  return router
}
