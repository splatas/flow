const tap = require('tap')
const Ajv = require('ajv')

const { app, logger } = require('../../src/app')
const { schema } = require('../../src/paths/common/ping')

logger.level = 'fatal'

const ajv = new Ajv()
const validate = ajv.compile(schema.response[200])

tap.test('GET `/base/v1/ping` route', async (t) => {
  const fastify = await app()
  t.plan(3)
  t.tearDown(() => fastify.close())

  const response = await fastify.inject({
    method: 'GET',
    url: fastify.config.prefix + '/ping'
  })

  t.strictEqual(response.statusCode, 200)
  t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
  t.ok(validate(response.payload))
  t.end()
})
