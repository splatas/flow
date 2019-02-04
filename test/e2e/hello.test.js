const tap = require('tap')
const Ajv = require('ajv')

const fastify = require('fastify')()
const pack = require('../../package.json')
require('../../src/app')(fastify)
const prefix = fastify.config.prefix

const { schema } = require('../../src/paths/hello')(fastify)

const ajv = new Ajv()
tap.test('hello endpoints', t => {
  tap.tearDown(() => fastify.close())
  let validate
  let url

  url = prefix + '/totalMB'
  t.test(`GET '${url}' route`, t => {
    url = prefix + '/totalMB'
    validate = ajv.compile(schema.totalMB.response[200])

    fastify.inject({
      method: 'GET',
      url,
    }).then((response) => {
      t.strictEqual(response.statusCode, 200)
      t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')

      t.ok(validate(JSON.parse(response.payload)), validate.errors)
      t.end()
    }).catch((err) => {
      t.error(err)
      t.end()
    })
  })

  url = prefix + '/ping'
  t.test(`GET '${url}' route`, t => {
    url = prefix + '/ping'
    validate = ajv.compile(schema.ping.response[200])

    fastify.inject({
      method: 'GET',
      url,
    }).then((response) => {
      t.strictEqual(response.statusCode, 200)
      t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')

      t.ok(validate(JSON.parse(response.payload)), validate.errors)
      t.equal(response.payload, '"pong"')
      t.end()
    }).catch((err) => {
      t.error(err)
      t.end()
    })
  })

  url = prefix + '/now'
  t.test(`GET '${url}' route`, t => {
    url = prefix + '/now'
    validate = ajv.compile(schema.now.response[200])

    fastify.inject({
      method: 'GET',
      url,
    }).then((response) => {
      t.strictEqual(response.statusCode, 200)
      t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')

      t.ok(validate(JSON.parse(response.payload)), validate.errors)
      const now = Date.now()
      t.ok((now - response.payload) < 500, 'now +- 500ms')
      t.end()
    }).catch((err) => {
      t.error(err)
      t.end()
    })
  })

  url = prefix + '/revision'
  t.test(`GET '${url}' route`, t => {
    url = prefix + '/revision'
    validate = ajv.compile(schema.revision.response[200])

    fastify.inject({
      method: 'GET',
      url,
    }).then((response) => {
      t.strictEqual(response.statusCode, 200)
      t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')

      t.ok(validate(JSON.parse(response.payload)), validate.errors)
      t.strictEqual(response.payload, '"' + pack['x-git-version'] + '"')
      t.end()
    }).catch((err) => {
      t.error(err)
      t.end()
    })
  })

  url = prefix + '/unauth'
  t.test(`GET '${url}' route`, t => {
    url = prefix + '/unauth'

    fastify.inject({
      method: 'GET',
      url,
    }).then((response) => {
      console.log(response.statusCode, 'statuuuuuuuuuuuuuuuuuus code')
      t.strictEqual(response.statusCode, 403)
      t.end()
    }).catch((err) => {
      t.error(err)
      t.end()
    })
  })

  url = prefix + '/doesnotexists'
  t.test(`GET '${url}' route`, t => {
    url = prefix + '/doesnotexists'

    fastify.inject({
      method: 'GET',
      url,
    }).then((response) => {
      t.strictEqual(response.statusCode, 404)
      t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
      t.end()
    }).catch((err) => {
      t.error(err)
      t.end()
    })
  })

  url = prefix + '/ping'
  t.test(`OPTIONS '${url}' route`, t => {
    url = prefix + '/ping'

    fastify.inject({
      method: 'OPTIONS',
      url,
    }).then((response) => {
      t.strictEqual(response.statusCode, 200)
      t.end()
    }).catch((err) => {
      t.error(err)
      t.end()
    })
  })

  t.end()
})
