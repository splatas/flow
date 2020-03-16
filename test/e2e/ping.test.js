const Ajv = require('ajv')

const { app, logger } = require('../../src/app')
const { schema } = require('../../src/paths/common/ping')
logger.level = 'fatal'

const ajv = new Ajv()
const validate = ajv.compile(schema.response[200])

describe('Running tests', () => {
  let fastify
  test('GET `/base/v1/ping` route, should return status 200', async done => {
    fastify = await app()
    const response = await fastify.inject({
      method: 'GET',
      url: fastify.config.prefix + '/ping'
    })
    typeof response.statusCode === 'number'
      ? expect(response.statusCode).toBe(200)
      : expect(response.statusCode).toBe('200')

    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    )
    expect(validate(response.payload)).toBeTruthy()
    done()
  })

  afterAll(async () => {
    fastify.close()
  })
})
