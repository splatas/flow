const { decoType, decoStatus } = require('../../constants/devices')
const { NO_RETAIL } = decoType

const service = {
  decoType: async (fastify, mac) => {
    try {
      const deco = await fastify.db.Device.findOne({ where: { mac } })

      if (!deco) return { status: NO_RETAIL }

      // Si el status no existe devolverá un objeto vacio.
      return { status: decoStatus[deco.status] }
    } catch (e) {
      if(Array.isArray(e.errors)) e = e.errors[0].message
      throw new Error(e)
    }
  },
}

module.exports = service
