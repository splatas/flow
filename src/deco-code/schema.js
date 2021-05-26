'use strict'
const schema = {
  tags: ['retail'],
  summary: 'Generate Code of activation',
  description: 'Permite generar un codigo de activación a para un deco retail',
  querystring: {
    type: 'object',
    properties: {
      macAddress: {
        type: 'string'
      }
    },
    required: [
      'macAddress'
    ],
    example: {
      macAddress: '14:13:46:D1:E5:16'
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        exp: { type: 'string' },
        msg: { type: 'string' },
        label: { type: 'string' }
      },
      example: {
        code: '1A2B8',
        exp: 1620668011
      }
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    },
    403: {
      description: 'Forbidden',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    },
    404: {
      description: 'Could not provision',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    },
    500: {
      description: 'Generic server error',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
}

module.exports = schema
