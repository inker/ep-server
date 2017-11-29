const db = require('../db')

const PERMISSION_NAME_COL_ALIAS = 'permission_name'

const SELECT_PERMISSIONS_QUERY = `
  SELECT permissions.name as ${PERMISSION_NAME_COL_ALIAS} FROM users
  INNER JOIN users_permissions ON users.id = users_permissions.user_id
  INNER JOIN permissions ON users_permissions.permission_id = permissions.id
  WHERE users.username = $1
`
/**
 * @param {string[]} exemptServices - do not check for permissions when running these services
 */
module.exports = ({
  exemptServices,
} = {}) => async (req, res, next) => {
  const pathTokens = req.path.split('/')
  if (exemptServices && exemptServices.includes(pathTokens[1])) {
    return next()
  }

  const { auth } = req.body

  if (!auth) {
    return res.send({
      error: {
        type: 'NO_AUTH',
      },
    })
  }

  const { rows } = await db.pg.query({
    text: SELECT_PERMISSIONS_QUERY,
    values: [auth.login],
  })

  const permissions = rows.map(row => `/${row[PERMISSION_NAME_COL_ALIAS]}`)

  if (!permissions.includes(req.path)) {
    return res.send({
      error: {
        type: 'ACCESS_DENIED',
      },
    })
  }

  req.permissions = rows.map(row => row[PERMISSION_NAME_COL_ALIAS])

  next()
}
