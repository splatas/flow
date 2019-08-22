const md5 = require('./md5')

module.exports = genReqId

function genReqId (req) {
  const reqId = req.headers['x-request-id'] || md5(Date.now() + '')
  return reqId
}
