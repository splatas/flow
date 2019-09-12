module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.statusCode = 200
    res.setHeader('access-control-max-age', '86400') // 86400: 24 hs
  }
  res.setHeader('access-control-allow-origin', '*')
  res.setHeader('access-control-allow-methods', 'GET, POST, DELETE, HEAD, OPTIONS')
  res.setHeader('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept, Range, Authorization, X-Request-ID')

  if (req.method === 'HEAD' && req.url === '/prm/v1/ping') {
    // ignore balancer requests
    return res.end()
  }
  if (req.method === 'OPTIONS') {
    return res.end()
  }
  next()
}
