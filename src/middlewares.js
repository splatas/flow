const jwt = require('jsonwebtoken')
const config = require('./config')

module.exports = (fastify) => {
  fastify.decorate('config', config)
  return { cors, bearer }

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

  function bearer(req, res, next) {
    if (req.method === 'OPTIONS' || config.whitelist.indexOf(req.url) >= 0) {
      return next()
    }
    if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') !== 0) {
      res.statusCode = 403
      return res.end('Token not found')
    }

    const token = req.headers.authorization.substr(7) // 7 => 'Bearer '.length
    try {
      const decoded = jwt.verify(token, config.secret)
      res.user = decoded.data
    } catch(err) {
      res.statusCode = 403
      res.end(err.message)
    }
    next()
  }
}
