const isMobilePhone = require('validator/lib/isMobilePhone')

const db = require('../../db')

module.exports = async (req, res) => {
  const { auth, data } = req.body
  try {
    if (!data || !data.phoneNumber) {
      return res.send({
        error: 'PHONE_NUMBER_REQUIRED',
      })
    }
    const { phoneNumber } = data
    if (!isMobilePhone(phoneNumber, 'any')) {
      return res.send({
        error: 'INVALID_PHONE_NUMBER',
      })
    }
    const q = `INSERT INTO phone_numbers (number) VALUES ('${phoneNumber}')`
    const result = await db.pg.query(q)
    console.log('res', result)
    res.send({
      data: {
        phoneNumber,
      },
    })
  } catch (err) {
    console.error(err)
    return res.send({
      error: 'SERVER_ERROR',
    })
  }
}
