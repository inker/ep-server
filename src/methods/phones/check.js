const db = require('../../db')

const SELECT_PHONE_NUMBER_ID_QUERY = 'SELECT id FROM phone_numbers WHERE phone_numbers.number = $1;'

module.exports = async ({ data }) => {
  try {
    if (!data || !data.phoneNumber) {
      return {
        error: {
          type: 'PHONE_NUMBER_REQUIRED',
        },
      }
    }

    const { phoneNumber } = data
    const { rows } = await db.pg.query({
      text: SELECT_PHONE_NUMBER_ID_QUERY,
      values: [phoneNumber],
    })
    console.log('res', rows)
    return {
      data: {
        exists: rows.length > 0,
      },
    }
  } catch (err) {
    console.error(err)
    return {
      error: {
        type: 'SERVER_ERROR',
      },
    }
  }
}
