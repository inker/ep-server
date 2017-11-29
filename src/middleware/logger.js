const chalk = require('chalk').default

module.exports = () => (req, res, next) => {
  console.log(chalk.gray(`[${new Date()}]`))
  console.log(chalk.bold.cyan(req.path))
  console.log(JSON.stringify(req.body, null, 2))
  next()
}
