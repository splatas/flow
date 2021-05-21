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
          description: 'values: NO_RETAIL, ALREDY_ACTIVE, INACTIVE'
        },
      },
      example: {
        status: 'ALREDY_ACTIVE'
      }
    }
  }
}

module.exports = schema
