const isMobilePhone = require('validator/lib/isMobilePhone')

const db = require('../../db')

const INSERT_PHONE_NUMBER_QUERY = 'INSERT INTO phone_numbers (number) VALUES ($1);'

module.exports = async (req, res) => {
  const { data } = req.body
  try {
    if (!data || !data.phoneNumber) {
      return res.send({
        error: {
          type: 'PHONE_NUMBER_REQUIRED',
        },
      })
    }
    const { phoneNumber } = data
    if (!isMobilePhone(phoneNumber, 'any')) {
      return res.send({
        error: {
          type: 'INVALID_PHONE_NUMBER',
        },
      })
    }
    const result = await db.pg.query({
      text: INSERT_PHONE_NUMBER_QUERY,
      values: [phoneNumber],
    })
    console.log('res', result)
    res.send({
      data: {
        phoneNumber,
      },
    })
  } catch (err) {
    console.error(err)
    return res.send({
      error: {
        type: 'SERVER_ERROR',
      },
    })
  }
}
