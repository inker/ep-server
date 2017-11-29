const isMobilePhone = require('validator/lib/isMobilePhone')

const db = require('../../db')

const INSERT_PHONE_NUMBER_QUERY = 'INSERT INTO phone_numbers (number) VALUES ($1) RETURNING *;'

module.exports = async ({ data }) => {
  if (!data || !data.phoneNumber) {
    return {
      error: {
        type: 'PHONE_NUMBER_REQUIRED',
      },
    }
  }

  const { phoneNumber } = data
  if (!isMobilePhone(phoneNumber, 'any')) {
    return {
      error: {
        type: 'INVALID_PHONE_NUMBER',
      },
    }
  }

  try {
    const { rows } = await db.pg.main.query({
      text: INSERT_PHONE_NUMBER_QUERY,
      values: [phoneNumber],
    })

    return {
      data: {
        phoneNumber: rows[0].number,
      },
    }
  } catch (err) {
    console.error(err)
    if (err.code === '23505') {
      return {
        error: {
          type: 'ALREADY_EXISTS',
          message: 'Phone number already exists',
        },
      }
    }

    throw err
  }
}
