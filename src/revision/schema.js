const schema = {
  tags: ['common'],
  summary: 'Revision',
  description: 'Returns git last hash',
  response: {
    200: {
      description: 'revision',
      type: 'string'
    }
  }
}

module.exports = schema
