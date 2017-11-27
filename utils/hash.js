const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10

module.exports = (myPlaintextPassword) =>
  bcrypt.hash(myPlaintextPassword, SALT_ROUNDS)
