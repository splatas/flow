const nock = require('nock')
const { app, logger } = require('../core/app')
const ResponseError = require('./ResponseError')
const errorHandler = require('./errorHandler')
const corsHook = require('./corsHook')
const { serializers: { req: reqLogger, res: resLogger } } = require('./logger')
const { api, url } = require('../core/loggly')
logger.level = 'fatal'

describe('Running tests', () => {
  let fastify

  beforeAll(async () => {
    fastify = await app()
  })

  test('response error', async done => {
    const data = {
      message: 'error message',
      statusCode: 200
    }
    const error = new ResponseError(data)
    expect(error.statusCode).toBe(data.statusCode)
    expect(error.message).toBe(data.message)
    done()
  })

  test('cors hook', async done => {
    let value = 'error'
    const reply = {
      send(err) {
        value = err
      },
      header() { }
    }
    const req = {
      method: 'OPTIONS'
    }
    corsHook(req, reply, () => { })
    expect(value).toBe('')
    value = 'error'
    req.method = 'HEAD'
    corsHook(req, reply, () => { })
    expect(value).toBe('')
    done()
  })

  test('error handler', done => {
    nock(api)
      .post(url.replace(api, ''))
      .query(true)
      .reply(200)
    let value = 'error'
    const error = {
      message: 'Testing 404 Not Found'
    }
    const reqq = {
      ip: '1.2.3.4',
      log: {
        error() { },
      },
    }
    const repl = {
      statusCode: 200,
      status(code) {
        this.statusCode = code
        return this
      },
      send(obj) {
        value = obj
        return this
      }
    }
    errorHandler(error, reqq, repl)
    expect(value.message).toBe(error.message)
    done()
  })

  test('utils/logger', done => {
    const reply = {
      statusCode: 200,
      request: {
        method: 'POST',
        url: 'url',
        ip: '1.2.3.4'
      }
    }
    expect(reqLogger('log')).toBe('')
    const res = resLogger(reply)
    expect(res.stat).toBe(reply.statusCode)
    expect(res.meth).toBe(reply.request.method)
    expect(res.url).toBe(reply.request.url)
    expect(res.addr).toBe(reply.request.ip)
    done()
  })

  afterAll(async () => {
    fastify.close()
    nock.cleanAll()
  })
})
