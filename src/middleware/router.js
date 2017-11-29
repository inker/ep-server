const express = require('express')
const path = require('path')

const router = express.Router()

function defineRoute(route, methodsPath) {
  const method = require(path.join(methodsPath, route))
  const cb = (req, res) =>
    method(req.body).then(resData => {
      res.send(resData)
    }).catch(err => {
      console.error(err)
      res.send({
        error: {
          type: 'SERVER_ERROR',
        },
      })
    })
  router.post(route, cb)
}

module.exports = (routes, methodsPath) => {
  if (!routes) {
    throw new Error('Provide router object')
  }
  for (const routeKey of Object.keys(routes)) {
    const methodNames = routes[routeKey]
    for (const methodName of methodNames) {
      defineRoute(`/${routeKey}/${methodName}`, methodsPath)
    }
  }
  return router
}
