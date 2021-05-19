'use strict'
const schema = {
  summary: 'Deco Type',
  tags: ['deco-retail'],
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string'
              }
            }
          },
          examples: {
            'deco no retail': {
              value: {
                status: 'NO_RETAIL'
              }
            },
            'deco retail activo': {
              value: {
                status: 'ACTIVE'
              }
            },
            'deco retail inactivo': {
              value: {
                status: 'INACTIVE'
              }
            }
          }
        }
      }
    }
  },
  operationId: 'get-retail-v1-type',
  description: 'Permite identificar si el deco es de tipo comodato o retail aportando si se encuentra activo o inactivo.',
  querystring: {
    schema: {
      type: 'string',
      example: '14:13:46:D1:E5:16'
    },
    type: 'object',
    properties: {
      macAddress: {
        type: 'string',
        description: 'Mac address del dispositivo',
      },
    },
    required: [
      'macAddress'
    ],
  },
}

module.exports = schema
