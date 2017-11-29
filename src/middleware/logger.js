const chalk = require('chalk').default

module.exports = () => (req, res, next) => {
  console.log(chalk.gray(`[${new Date()}]`), '\n', req.body)
  next()
}
