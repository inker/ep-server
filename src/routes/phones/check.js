const db = require('../../db')

const SELECT_PHONE_NUMBER_ID_QUERY = 'SELECT id FROM phone_numbers WHERE phone_numbers.number=$1;'

module.exports = async (req, res) => {
  const { auth, data } = req.body
  try {
    if (!data || !data.phoneNumber) {
      return res.send({
        error: 'PHONE_NUMBER_REQUIRED',
      })
    }

    const { phoneNumber } = data
    const { rows } = await db.pg.query({
      text: SELECT_PHONE_NUMBER_ID_QUERY,
      values: [phoneNumber],
    })
    console.log('res', rows)
    res.send({
      data: {
        exists: rows.length > 0,
      },
    })
  } catch (err) {
    console.error(err)
    return res.send({
      error: 'SERVER_ERROR',
    })
  }
}
