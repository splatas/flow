const loggly = require('../loggly')
const { responseErrorFancy, getUserOpt } = require('fl-loggly')

function errorHandler (error, request, reply) {
  request.log.error(error)

  const userOpt = getUserOpt(request)
  const fancyLog = responseErrorFancy(error.status || error.statusCode || 500, error, request, reply, userOpt)

  reply.send(error.err || error)
  loggly.log(fancyLog, request.ip)
}

module.exports = errorHandler
