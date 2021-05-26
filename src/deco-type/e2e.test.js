const Ajv = require('ajv')

const { app, logger } = require('../core/app')
const schema = require('./schema')
logger.level = 'fatal'

const ajv = new Ajv()
const validate = ajv.compile(schema.response[200])

const { NO_RETAIL, INACTIVE, CODE_VALIDATED, ACTIVE } = require('../../constants/devices')

describe('Deco-type tests', () => {
  let fastify

  beforeAll(async () => {
    fastify = await app()
  })

  test('GET `/deco-type` route, deco NO_RETAIL test', async done => {
    const macAddress = 'ABCD12345'
    const response = await fastify.inject({
      method: 'GET',
      url: fastify.config.prefix + '/deco-type',
      query: { macAddress }
    })

    const deco = await fastify.db.Device.findOne({ where: { mac: macAddress } })
    expect(deco).toBeFalsy()

    expect(response.statusCode).toBe(200)
    expect(validate(JSON.parse(response.payload))).toBeTruthy()
    expect(JSON.parse(response.payload).status).toBe(NO_RETAIL.LABEL)
    done()
  })

  test('GET `/deco-type` route, deco retail INACTIVE test', async done => {
    const macAddress = 'ABCD56789'
    await fastify.db.Device.create({ mac: macAddress }, { ignoreDuplicates: true })
    const response = await fastify.inject({
      method: 'GET',
      url: fastify.config.prefix + '/deco-type',
      query: { macAddress }
    })

    expect(response.statusCode).toBe(200)
    expect(validate(JSON.parse(response.payload))).toBeTruthy()
    expect(JSON.parse(response.payload).status).toBe(INACTIVE.LABEL)
    done()
  })

  test('GET `/deco-type` route, deco retail INACTIVE test with status CODE_VALIDATED', async done => {
    const macAddress = 'IJKL12345'
    await fastify.db.Device.create({ mac: macAddress, status: CODE_VALIDATED.CODE }, { ignoreDuplicates: true })
    const response = await fastify.inject({
      method: 'GET',
      url: fastify.config.prefix + '/deco-type',
      query: { macAddress }
    })

    expect(response.statusCode).toBe(200)
    expect(validate(JSON.parse(response.payload))).toBeTruthy()
    expect(JSON.parse(response.payload).status).toBe(INACTIVE.LABEL)
    done()
  })

  test('GET `/deco-type` route, deco retail ACTIVE test', async done => {
    const macAddress = 'EFGH12345'
    await fastify.db.Device.create({ mac: macAddress, status: ACTIVE.CODE }, { ignoreDuplicates: true })
    const response = await fastify.inject({
      method: 'GET',
      url: fastify.config.prefix + '/deco-type',
      query: { macAddress }
    })

    expect(response.statusCode).toBe(200)
    expect(validate(JSON.parse(response.payload))).toBeTruthy()
    expect(JSON.parse(response.payload).status).toBe(ACTIVE.LABEL)
    done()
  })

  test('GET `/deco-type` route, deco retail with unknown status', async done => {
    const macAddress = 'EFGH45678'
    const unknownStatus = 12345
    await fastify.db.Device.create({ mac: macAddress, status: unknownStatus }, { ignoreDuplicates: true })
    const response = await fastify.inject({
      method: 'GET',
      url: fastify.config.prefix + '/deco-type',
      query: { macAddress }
    })

    expect(response.statusCode).toBe(200)
    expect(validate(JSON.parse(response.payload))).toBeTruthy()
    done()
  })

  test('GET `/deco-type` route, Bad Request', async done => {
    const response = await fastify.inject({
      method: 'GET',
      url: fastify.config.prefix + '/deco-type'
    })

    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.payload).message).toBe("querystring should have required property 'macAddress'")
    done()
  })

  afterAll(async () => {
    fastify.close()
  })
})
