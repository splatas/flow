const jwt = require('jsonwebtoken')
const config = require('./config')

module.exports = (fastify) => {
  fastify.decorate('config', config)
  return { cors, bearerHandler }

  function cors(req, res, next) {
    if (req.method === 'OPTIONS') {
      res.statusCode = 200
      res.setHeader('access-control-max-age', '86400') // 86400: 24 hs
    }
    res.setHeader('access-control-allow-origin', '*')
    res.setHeader('access-control-allow-methods', 'GET, POST, DELETE, HEAD, OPTIONS')
    res.setHeader('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept, Range, Authorization, X-Request-ID')

    if (req.method === 'OPTIONS') {
      return res.end()
    }
    next()
  }

  function bearerHandler(req, reply, done) {
    const auth = bearerCommon(req)
    if (auth.code) {
      return reply.code(auth.code).send(auth.message)
    }

    reply.res.user = auth.user
    done()
  }

  function bearerCommon(req) {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') !== 0) {
      return { code: 403, message: 'Token not found' }
    }

    const token = req.headers.authorization.substr(7) // 7 => 'Bearer '.length
    try {
      const decoded = jwt.verify(token, config.secret)
      return { user: decoded.data }
    } catch(err) {
      return { code: 403, message: err.message }
    }
  }
}
