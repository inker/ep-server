const db = require('../../db')

const DELETE_PHONE_NUMBER_QUERY = 'DELETE FROM phone_numbers WHERE phone_numbers.number=$1;'

module.exports = async (req, res) => {
  const { auth, data } = req.body
  try {
    if (!data || !data.phoneNumber) {
      return res.send({
        error: 'PHONE_NUMBER_REQUIRED',
      })
    }

    const { phoneNumber } = data
    const { rowCount } = await db.pg.query({
      text: DELETE_PHONE_NUMBER_QUERY,
      values: [phoneNumber],
    })
    console.log('res', rowCount)
    const sentData = {}
    if (rowCount > 0) {
      sentData.phoneNumber = phoneNumber
    }
    res.send({
      data: sentData,
    })
  } catch (err) {
    console.error(err)
    return res.send({
      error: 'SERVER_ERROR',
    })
  }
}
