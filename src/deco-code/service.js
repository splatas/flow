const moment = require('moment')
const {
  NO_RETAIL, ACTIVE
} = require('../../constants/devices')

const service = {
  getCode: async (fastify, mac) => {
    try {
      let codeRepeted = true
      let code

      const deco = await fastify.db.Device.findOne({
        attributes: ['id', 'mac', 'status'],
        include: [{ model: fastify.db.Alphanum, as: 'alphanum', attributes: ['id', 'createdAt', 'updatedAt'] }],
        where: { mac }
      })

      if (!deco) return { status: NO_RETAIL.LABEL, msg: NO_RETAIL.MSG }
      if (deco.status === ACTIVE.CODE) return { status: ACTIVE.LABEL, msg: ACTIVE.MSG }

      do {
        code = Math.random().toString(36).substring(2, 7).toUpperCase()
        const codeIsUnique = await fastify.db.Alphanum
          .findOne({ attributes: ['id'], where: { code } })

        if (!codeIsUnique) codeRepeted = false
      } while (codeRepeted)

      if (deco.alphanum.length) {
        await fastify.db.Alphanum.destroy({ where: { device_id: deco.id } })
      }

      const data = {
        code,
        device_id: deco.id,
      }

      const alphanum = await fastify.db.Alphanum
        .create(data)

      const exp = moment(alphanum.createdAt).add(15, 'm').unix()

      return { code, exp }
    } catch (e) {
      throw new Error(Array.isArray(e.errors) ? e.errors[0].message : e)
    }
  },
}

module.exports = service
