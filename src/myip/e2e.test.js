const Ajv = require('ajv')

const { app, logger } = require('../core/app')
const schema = require('./schema')
logger.level = 'fatal'

const ajv = new Ajv()
const validate = ajv.compile(schema.response[200])

describe('Running tests', () => {
  let fastify
  test('GET `/base/v1/myip` route, should return status 200', async done => {
    fastify = await app()
    const pattern = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/
    const response = await fastify.inject({
      method: 'GET',
      url: fastify.config.prefix + '/myip'
    })
    typeof response.statusCode === 'number'
      ? expect(response.statusCode).toBe(200)
      : expect(response.statusCode).toBe('200')

    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    )
    expect(validate(response.payload)).toBeTruthy()
    expect(response.body).toMatch(pattern)
    done()
  })

  afterAll(async () => {
    fastify.close()
  })
})
