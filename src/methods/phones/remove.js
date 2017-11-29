const db = require('../../db')

const DELETE_PHONE_NUMBER_QUERY = 'DELETE FROM phone_numbers WHERE phone_numbers.number = $1;'

module.exports = async ({ data }) => {
  if (!data || !data.phoneNumber) {
    return {
      error: {
        type: 'PHONE_NUMBER_REQUIRED',
      },
    }
  }

  const { phoneNumber } = data
  const { rowCount } = await db.pg.main.query({
    text: DELETE_PHONE_NUMBER_QUERY,
    values: [phoneNumber],
  })
  console.log('res', rowCount)
  const sentData = {}
  if (rowCount > 0) {
    sentData.phoneNumber = phoneNumber
  }
  return {
    data: sentData,
  }
}
