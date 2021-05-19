'use strict'
const schema = {
  summary: 'Generate Code of activation',
  tags: ['deco-retail'],
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                description: 'Codigo de activación',
                example: 'ABC12'
              },
              exp: {
                type: 'integer',
                description: 'Tiempo de expiración en tiempo unix',
                example: 1620668011
              }
            },
            required: [
              'code',
              'exp'
            ]
          },
          examples: {
            'New Code': {
              value: {
                code: 'ABC12',
                exp: 1620668011
              }
            }
          }
        }
      }
    }
  },
  operationId: 'get-retail-v1-code',
  description: 'Permite generar un codigo de activación a para un deco retail.',
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
