const revision = require('../../static/revision.json')

module.exports = {
  revision: getRevision
}

function getRevision(request, reply) {
  reply.type('application/json').send(revision)
}
