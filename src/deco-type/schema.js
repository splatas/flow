const schema = {
  tags: ['retail'],
  summary: 'Deco Type',
  description: 'Permite identificar si el deco es de tipo comodato o retail aportando si se encuentra activo o inactivo',
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
        status: {
          type: 'string',
          description: 'values: NO_RETAIL, ACTIVE, INACTIVE'
        },
      },
      example: {
        status: 'ACTIVE'
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
