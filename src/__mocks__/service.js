async function getIP(fastify) {
  return Promise.resolve({ ip: '192.168.1.0' })
}

module.exports = getIP
