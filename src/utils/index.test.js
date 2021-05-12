const nock = require('nock')
const { genReqId, md5, timestamp } = require('./index')
const { app, logger } = require('../core/app')
logger.level = 'fatal'

describe('Utils index functions', () => {
  let fastify

  beforeAll(async () => {
    fastify = await app()
  })

  afterAll(() => {
    fastify.close()
  })

  it('Function genReqId', async (done) => {
    const reqId = await genReqId()
    expect(reqId).toBeGreaterThan(0)

    done()
  })

  it('Function md5', async (done) => {
    const hash = await md5('holamundo!')
    expect(hash).toMatchSnapshot()

    done()
  })

  it('Function Request', async (done) => {
    const url = 'http://www.example.com'
    nock(url).get('/hello').reply(200)
    nock(url).persist().post('/hello', { hola: 'mundo' }).reply(201)

    const [caseGet, casePost, casePostHeaders] = await Promise.all([
      fastify.request(`${url}/hello`),
      fastify.request(`${url}/hello`, { body: { hola: 'mundo' }, method: 'post' }),
      fastify.request(`${url}/hello`, { body: { hola: 'mundo' }, method: 'post', headers: { example: 'hello' } }),
    ])

    expect(caseGet.status).toBe(200)
    expect(casePost.status).toBe(201)
    expect(casePostHeaders.status).toBe(201)

    done()
  })

  it('Function RequestJSON', async (done) => {
    const url = 'http://www.example2.com'
    const res = { hola: 'mundo' }

    nock(url).get('/hello').reply(200, res)
    nock(url).persist().post('/hellos', res).reply(200, res)

    const [caseGet, casePost, casePostHeaders] = await Promise.all([
      fastify.requestJSON(`${url}/hello`),
      fastify.requestJSON(`${url}/hellos`, { body: { hola: 'mundo' }, method: 'post' }),
      fastify.requestJSON(`${url}/hellos`, { body: { hola: 'mundo' }, method: 'post', headers: { example: 'hello' } }),
    ])

    expect(caseGet).toEqual(res)
    expect(casePost).toEqual(res)
    expect(casePostHeaders).toEqual(res)

    done()
  })

  it('Function timestamp', async done => {
    const date = timestamp()
    expect(date).not.toBeNull()

    done()
  })
})
