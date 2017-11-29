const express = require('express')
const path = require('path')

const router = express.Router()

function sendServerError(res) {
  res.send({
    error: {
      type: 'SERVER_ERROR',
    },
  })
}

const getRouteHandler = (method) =>
  (req, res) =>
    method(req.body).then(resData => {
      res.send(resData)
    }).catch(err => {
      console.error(err)
      sendServerError(res)
    })

module.exports = (routes, methodsPath) => {
  if (!routes) {
    throw new Error('Provide router object')
  }
  for (const routeKey of Object.keys(routes)) {
    const methodNames = routes[routeKey]
    for (const methodName of methodNames) {
      const route = `/${routeKey}/${methodName}`
      const method = require(path.join(methodsPath, route))
      router.post(route, getRouteHandler(method))
    }
  }
  return router
}
