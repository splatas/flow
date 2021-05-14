const Ajv = require('ajv')

const variables = require('../../config/variables')
const env = variables.environment || 'local'

const { app, logger } = require('../core/app')
const schema = require('./schema')
const fixtures = require('../../static/fixtures.json')[env]
logger.level = 'fatal'

const ajv = new Ajv()
const validate = ajv.compile(schema.response[200])

describe('Running tests', () => {
  let fastify

  beforeAll(async () => {
    fastify = await app()
  })

  test('GET `/base/v1/jwt` route, should return status 200', async done => {
    const response = await fastify.inject({
      method: 'GET',
      url: fastify.config.prefix + '/jwt',
      headers: { Authorization: fixtures.token }
    })
    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    )
    expect(validate(JSON.parse(response.payload))).toBeTruthy()
    done()
  })

  test('GET `/base/v1/jwt` route, error case', async done => {
    const response = await fastify.inject({
      method: 'GET',
      url: fastify.config.prefix + '/jwt',
      headers: { Authorization: 'wrongtoken' }
    })

    expect(response.statusCode).toBe(400)
    done()
  })

  afterAll(async () => {
    fastify.close()
  })
})
