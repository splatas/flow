'use strict'
const schema = {
  tags: ['common'],
  summary: 'Server Public IP',
  description: 'Server Public IP',
  response: {
    200: {
      description: 'IP',
      type: 'string'
    }
  }
}

module.exports = schema
