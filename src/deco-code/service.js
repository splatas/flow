const { decoType, decoStatus } = require('../../constants/devices')
const { NO_RETAIL } = decoType

const service = {
  getCode: async (fastify, mac) => {
    // try {
    const deco = await fastify.db.Device.findOne({
      attributes: ['mac', 'status'],
      include: [{ model: fastify.db.Alphanum, as: 'alphanum', attributes: ['code', 'createdAt'] }],
      where: { mac }
    })

    if (!deco) return { status: NO_RETAIL }
    if(decoStatus[deco.status] === 'ACTIVE') return { status: decoStatus[deco.status] }

    deco.alphanum.code = Math.random().toString(36).substring(2, 7).toUpperCase()
    // deco.alphanum[0].createdAt = new Date()
    // deco.alphanum[0].updatedAt = new Date()

    // console.log(await deco.save())

    return { status: decoStatus[deco.status] }
    // } catch (e) {
    //   if(Array.isArray(e.errors)) e = e.errors[0].message
    //   throw new Error(e)
    // }
  },
}

module.exports = service

// const code = Math.random().toString(36).substring(2, 7).toUpperCase()
// await fastify.db.Device.create({ mac, alphanum: [{ code }] }, {
//   include: [{ model: fastify.db.Alphanum, as: 'alphanum' }]
// })
