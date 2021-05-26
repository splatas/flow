/* eslint-disable no-ex-assign */

const { getStatusLabelForId } = require('../utils')
const statusCode = require('../../constants/devices')
const {
  NO_RETAIL, INACTIVE, REQUESTED_CODE, CODE_VALIDATED, ACTIVE
} = statusCode
const service = {
  decoType: async (fastify, mac) => {
    try {
      const deco = await fastify.db.Device
        .findOne({ where: { mac } })

      if (!deco) return { status: NO_RETAIL.LABEL }
      const status = getStatusLabelForId(deco.status, statusCode)

      if ([INACTIVE.LABEL, REQUESTED_CODE.LABEL, CODE_VALIDATED.LABEL].includes(status)) {
        return { status: INACTIVE.LABEL }
      }

      if (status === ACTIVE.LABEL) return { status: ACTIVE.LABEL }

      // si el status no existe en decoStatus devolverá solo 200 y {}
      return {}
    } catch (e) {
      if (Array.isArray(e.errors)) e = e.errors[0].message
      throw new Error(e)
    }
  }
}

module.exports = service
